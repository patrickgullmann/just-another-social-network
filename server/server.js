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

app.use(compression());

app.use(express.json());

app.use(
    cookieSession({
        secret: secrets,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

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

    hash(password)
        .then((hashedPassword) => {
            db.addUser(first, last, email, hashedPassword)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("err adding user to db or cookie", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err hashing password", err);
            res.json({ success: false });
        });
});

app.post("/login.json", (req, res) => {
    const { email, password: passwordInserted } = req.body;
    db.getUserPasswordByEmail(email)
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
    db.getUserPasswordByEmail(email)
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

/* all routes before here! */
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log(" 🌎 I'm listening on 3001 (or 3000 webpack) 🌴 🐙 ");
});

//note we have translating (that we can use tags in js) -> babel
//and bundling -> webpack (to combine all js to one big one)
//npm run dev:server // npm run dev:client // npm run build (shows bundle)

//but even we have 3001 one here webpack uses 3000 !!! -> so we have webpack in between so we go on

/* -----------------------------------------------------------
/* Try specific error messages and and registration.js set error to the response.errText*/
/* ----------------------------------------------------------- */

// if (
//     err.message ==
//     `null value in column "first" of relation "users" violates not-null constraint`
// ) {
//     res.json({
//         success: false,
//         errText: "Missing First Name",
//     });
//     return;
// }
// if (
//     err.message ==
//     `null value in column "last" of relation "users" violates not-null constraint`
// ) {
//     res.json({
//         success: false,
//         errText: "Missing Last Name",
//     });
//     return;
// }
// if (
//     err.message ==
//     `duplicate key value violates unique constraint "users_email_key"`
// ) {
//     res.json({
//         success: false,
//         errText: "Email Address Already Taken",
//     });
//     return;
// }
// res.json({
//     success: false,
//     errText: "Something went wrong, please try again",
// });
