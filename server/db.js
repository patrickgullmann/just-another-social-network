const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

exports.addUser = (first, last, email, hashedPassword) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, hashedPassword]
    );
};

exports.getUserPasswordAndIdByEmail = (email) => {
    return db.query(`SELECT id, password FROM users WHERE email = $1`, [email]);
};

exports.insertSecretCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
        VALUES ($1, $2) RETURNING id`,
        [email, code]
    );
};

exports.getCurrentValidCodes = (email) => {
    return db.query(
        `SELECT * FROM reset_codes 
        WHERE email = $1 AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`,
        [email]
    );
};

exports.updateUserPassword = (email, hashedPassword) => {
    return db.query(`UPDATE users SET password = $2 WHERE email = $1`, [
        email,
        hashedPassword,
    ]);
};

exports.getUserInformation = (idFromCookie) => {
    return db.query(
        `SELECT id, first, last, image_url, biography FROM users WHERE id = $1`,
        [idFromCookie]
    );
};

exports.updateProfilePicture = (idFromCookie, imageUrl) => {
    return db.query(
        `UPDATE users SET image_url = $2 WHERE id = $1 RETURNING image_url`,
        [idFromCookie, imageUrl]
    );
};

exports.updateBiography = (idFromCookie, biography) => {
    return db.query(
        `UPDATE users SET biography = $2 WHERE id = $1 RETURNING biography`,
        [idFromCookie, biography]
    );
};

exports.findMostRecentUsers = () => {
    return db.query(
        `SELECT id, first, last, image_url, biography FROM users ORDER BY id DESC LIMIT 3`
    );
};

exports.findUsers = (searchTerm) => {
    return db.query(
        `SELECT id, first, last, image_url, biography FROM users WHERE first ILIKE $1 LIMIT 3`,
        [searchTerm + "%"]
    );
};

exports.findSpecificUserById = (id) => {
    return db.query(
        `SELECT id, first, last, image_url, biography FROM users WHERE id = $1`,
        [id]
    );
};

exports.getFriendshipStatus = (myId, otherUserId) => {
    return db.query(
        `SELECT * FROM friendships
            WHERE (sender_id = $1 AND recipient_id = $2)
            OR (sender_id = $2 AND recipient_id = $1);`,
        [myId, otherUserId]
    );
};

//no need for returning anything bc we just set strings in server.js
exports.addFriendRequest = (myId, otherUserId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id, accepted)
        VALUES ($1, $2, false)`,
        [myId, otherUserId]
    );
};

//no or needed bc the accept can only be seen when I am the recipient!
exports.acceptFriendRequest = (myId, otherUserId) => {
    return db.query(
        `UPDATE friendships SET accepted = true 
            WHERE sender_id = $2 AND recipient_id = $1;`,
        [myId, otherUserId]
    );
};

exports.deleteFriendship = (myId, otherUserId) => {
    return db.query(
        `DELETE FROM friendships 
            WHERE (sender_id = $1 AND recipient_id = $2)
            OR (sender_id = $2 AND recipient_id = $1);`,
        [myId, otherUserId]
    );
};

exports.getFriendsAndWannabees = (myId) => {
    return db.query(
        `SELECT users.id, first, last, image_url, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND recipient_id = users.id);`,
        [myId]
    );
};

exports.getLastTenMessages = () => {
    return db.query(
        `SELECT messages.id AS message_id, sender_id, first, last, image_url, message 
            FROM messages
            JOIN users
            ON messages.sender_id = users.id 
            ORDER BY messages.id DESC
            LIMIT 10;`
    );
};

exports.addMessage = (myId, messageText) => {
    return db.query(
        `INSERT INTO messages (sender_id, message)
        VALUES ($1, $2) RETURNING id`,
        [myId, messageText]
    );
};

exports.getMyLastMessageInfo = (messageId) => {
    return db.query(
        `SELECT messages.id AS message_id, sender_id, first, last, image_url, message 
            FROM messages
            JOIN users
            ON messages.sender_id = users.id 
            WHERE messages.id = $1;`,
        [messageId]
    );
};
