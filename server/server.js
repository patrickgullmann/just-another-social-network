const { smileys, randomIntFromInterval } = require("./smileys.js");

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const cookieSession = require("cookie-session");
const secrets =
    process.env.SESSION_SECRET || require("./secrets").COOKIE_SECRET;
const { hash, compare } = require("./auth");
const db = require("./db");

const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

const { uploader } = require("./upload");
const s3 = require("./s3");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());

app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret: secrets,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

//just that our socket.io can also use below the cookie and userId in it!
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    next();
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.post("/register.json", function (req, res) {
    const { first, last, email, password } = req.body;

    //einmal andere Version von Chaining
    hash(password)
        .then((hashedPassword) => {
            return db.addUser(first, last, email, hashedPassword);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("err at registering", err);
            res.json({ success: false });
        });
});

app.post("/login.json", (req, res) => {
    const { email, password: passwordInserted } = req.body;
    db.getUserPasswordAndIdByEmail(email)
        .then((result) => {
            const { password: passwordFromDb, id: userIdFromDb } =
                result.rows[0];
            compare(passwordInserted, passwordFromDb)
                .then((match) => {
                    if (match) {
                        req.session.userId = userIdFromDb;
                        res.json({ success: true });
                    } else {
                        //req.session = null; //?
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("err comparing passwords", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err getting data from db (no user?)", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/start.json", function (req, res) {
    const { email } = req.body;

    //just reuse query with other purpose -> find if user exists
    db.getUserPasswordAndIdByEmail(email)
        .then((result) => {
            if (result.rows.length == 0) {
                res.json({ success: false });
            } else {
                //insert resetCode for user
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.insertSecretCode(email, secretCode)
                    .then(() => {
                        //send code to user (email)
                        //we would put the email!!! but AWS does only allow one in free version
                        const recipient = "heathered.justice@spicedling.email";
                        ses.sendEmail(recipient, secretCode, "Reset Code")
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("err by sending email", err);
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("err by inserting code in db", err);
                        res.json({ success: false });
                    });
            }
        })
        .catch((err) => {
            console.log("err by finding user in db", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/verify.json", function (req, res) {
    const { email, code, newPassword } = req.body;

    db.getCurrentValidCodes(email)
        .then((result) => {
            if (result.rows.length == 0) {
                res.json({ success: false });
            } else {
                for (let i = 0; i < result.rows.length; i++) {
                    if (result.rows[i].code == code) {
                        hash(newPassword)
                            .then((hashedPassword) => {
                                db.updateUserPassword(email, hashedPassword)
                                    .then(() => {
                                        res.json({ success: true });
                                    })
                                    .catch((err) => {
                                        console.log("err update password", err);
                                        res.json({ success: false });
                                    });
                            })
                            .catch((err) => {
                                console.log("err hashing password", err);
                                res.json({ success: false });
                            });
                        //sonst werden ja zwei res gesendet, siehe unten
                        return;
                    }
                }
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err by getting current valid codes", err);
            res.json({ success: false });
        });
});

app.get("/user.json", function (req, res) {
    //get the info from the logged in user
    db.getUserInformation(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("err by getting user info from db", err);
        });
});

app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
    //we dont have a body here with description
    console.log("req.file: ", req.file); //from multer

    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

    if (req.file) {
        db.updateProfilePicture(req.session.userId, url)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log("error adding image to db: ", err);
            });
    } else {
        return res.sendStatus(500);
    }
});

app.post("/submit/biography.json", (req, res) => {
    //console.log("req.body: ", req.body);

    db.updateBiography(req.session.userId, req.body.draftBio)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error adding bio to db: ", err);
            return res.sendStatus(500);
        });
});

app.get("/api/find-users", function (req, res) {
    //req.query.search is the search term! and if nothing typed null?
    //console.log(req.query.search);
    if (req.query.search) {
        db.findUsers(req.query.search)
            .then(({ rows }) => {
                res.json(rows);
            })
            .catch((err) => {
                console.log("err by finding users from db", err);
            });
    } else {
        //not typed -> get 3 most recent users
        db.findMostRecentUsers()
            .then(({ rows }) => {
                res.json(rows);
            })
            .catch((err) => {
                console.log("err by finding most recent users from db", err);
            });
    }
});

app.get("/api/user/:id", function (req, res) {
    //console.log(req.params.id);
    db.findSpecificUserById(req.params.id)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({ notAnUser: true });
            } else if (req.session.userId == rows[0].id) {
                res.json({ currentUser: true });
            } else {
                res.json(rows[0]);
            }
        })
        .catch((err) => {
            console.log("err by finding specific user from db", err);
        });
});

app.get("/api/friendship/:otherUserId", function (req, res) {
    //my ID stored in cookies and the other user ID from the req
    db.getFriendshipStatus(req.session.userId, req.params.otherUserId)
        .then(({ rows }) => {
            //console.log(rows);
            // NOTE -> COULD have done status checking also here in server!
            res.json(rows);
        })
        .catch((err) => {
            console.log("err by getting friendship status from db", err);
        });
});

app.post("/api/friendship-status", function (req, res) {
    const { otherUserId, action } = req.body;

    if (action === "Send Friend Request") {
        db.addFriendRequest(req.session.userId, otherUserId)
            .then(() => {
                //brauchen kein obj wie res.json({ answer: "Cancel Friend Request" })
                res.json("Cancel Friend Request");
            })
            .catch((err) => {
                console.log("err by add friend request to db", err);
            });
    } else if (action === "Accept Friend Request") {
        db.acceptFriendRequest(req.session.userId, otherUserId)
            .then(() => {
                res.json("Unfriend");
            })
            .catch((err) => {
                console.log("err by updating friend request in db (acc)", err);
            });
    } else if (action === "Cancel Friend Request" || action === "Unfriend") {
        db.deleteFriendship(req.session.userId, otherUserId)
            .then(() => {
                res.json("Send Friend Request");
            })
            .catch((err) => {
                console.log("err by delete friend req/friendship in db", err);
            });
    }
});

app.get("/api/friends-wannabees", function (req, res) {
    db.getFriendsAndWannabees(req.session.userId)
        .then(({ rows }) => {
            //console.log(rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("err by getting friends/wannabees from db", err);
        });
});

app.post("/api/accept-friend", function (req, res) {
    db.acceptFriendRequest(req.session.userId, req.body.otherUserId)
        .then(() => {
            res.json({ otherUserId: req.body.otherUserId });
        })
        .catch((err) => {
            console.log("err by updating friend request in db (acc)", err);
        });
});

app.post("/api/unfriend/:otherUserId", function (req, res) {
    db.deleteFriendship(req.session.userId, req.params.otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("err by delete friend req/friendship in db", err);
        });
});

app.get("/api/check-private-chat-allowed/:otherUserId", function (req, res) {
    db.checkPrivateChatAllowed(req.session.userId, req.params.otherUserId)
        .then(({ rows }) => {
            if (rows.length == 0) {
                res.json({ allowed: false });
            } else if (rows[0].accepted == false) {
                res.json({ allowed: false });
            } else {
                res.json({ allowed: true });
            }
        })
        .catch((err) => {
            console.log("err by getting friends/wannabees from db", err);
        });
});

/* all routes before here! */
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log(
        ` ${
            smileys[randomIntFromInterval(0, smileys.length - 1)]
        } I'm listening on 3000 webpack ${
            smileys[randomIntFromInterval(0, smileys.length - 1)]
        } `
    );
});

let onlineUsers = {};

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    //setup for private messages
    onlineUsers[socket.id] = userId;
    console.log(onlineUsers);
    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        console.log(onlineUsers, "after one gone");
    });

    //get last ten messages and send them to socket.js (there to then to redux)
    const { rows: messages } = await db.getLastTenMessages();
    messages.reverse();
    socket.emit("last-10-messages", messages);

    //listen for getting a message
    socket.on("message", async (messageText) => {
        //add message to db
        const { rows } = await db.addMessage(userId, messageText);
        //get needed info for INSERTED massage from join userers/messages
        const { rows: messageInfo } = await db.getMyLastMessageInfo(rows[0].id);
        //emit to everbody
        io.emit("message-to-everybody", messageInfo[0]);
    });

    socket.on("get-last-10-private-messages", async (data) => {
        console.log(data.otherUserId);
        console.log(userId);

        const { rows: privateMessages } = await db.getLastTenPrivateMessages(
            userId,
            data.otherUserId
        );
        privateMessages.reverse();
        //note: the first, last, etc is ALWAYS the one from the sender
        socket.emit("send-last-10-private-messages", privateMessages);
    });

    socket.on("send-private-message", async (data) => {
        console.log(userId);
        console.log(data.otherUserId);
        console.log(data.privateMessageText);

        //add message to db
        const { rows } = await db.addPrivateMessage(
            userId,
            data.otherUserId,
            data.privateMessageText
        );
        //get needed info for INSERTED massage from join userers/messages
        const { rows: privateMessageInfo } =
            await db.getMyLastPrivateMessageInfo(rows[0].id);
        console.log(privateMessageInfo[0]);

        //prop sind sockets und onlineUsers[prop] sind IDs
        for (const prop in onlineUsers) {
            if (
                onlineUsers[prop] == userId ||
                onlineUsers[prop] == data.otherUserId
            ) {
                io.to(prop).emit(
                    "private-message-to-me-and-other-user",
                    privateMessageInfo[0]
                );
            }

            console.log("looop", prop);
            console.log("loop", onlineUsers[prop]);
        }
    });
});

//npm run dev:server // npm run dev:client // npm run build (shows bundle)
