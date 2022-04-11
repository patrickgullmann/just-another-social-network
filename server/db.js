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
