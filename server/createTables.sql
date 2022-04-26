DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reset_codes CASCADE;

-- new users table:
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    first       VARCHAR(255) NOT NULL CHECK (first != ''),
    last        VARCHAR(255) NOT NULL CHECK (last != ''),
    email       VARCHAR(255) NOT NULL UNIQUE CONSTRAINT valid_email CHECK (email ~ '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
    password    VARCHAR(255) NOT NULL,
    image_url   VARCHAR(255),
    biography   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- for code resetting:
CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--friendsss
CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--smth to test all of this stuff
INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES(206,1,true);
INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES(202,1,false);
DELETE FROM friendships WHERE id = 1;

INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES(190,1,false);
INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES(200,1,false);
INSERT INTO friendships (sender_id, recipient_id, accepted) VALUES(199,1,false);


-- table for the messages
CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id), 
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (sender_id, message) VALUES(1,'Hello World 🐝, love that first message!');
INSERT INTO messages (sender_id, message) VALUES(206,'Spammming as the second nice one!');
INSERT INTO messages (sender_id, message) VALUES(207,'Bli Bla Bluuuuu 🦍 ');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(210, 1, 'Was geht???');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(205, 1, 'Spammmmmmmm');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(1, 210, 'Mega nice hier 🐙');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(210, 209, 'Naja da sollten wir mal chatten');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(209, 1, 'Was geht? <3');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(1, 209, 'Nicht soviel und bei dir? :O');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(209, 1, 'Bissl abhängen mit Mushrooooms');
INSERT INTO messages (sender_id, recipient_id, message) VALUES(1, 209, 'WOOOOOOOW 🐶');