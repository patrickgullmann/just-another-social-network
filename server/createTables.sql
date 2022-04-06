DROP TABLE IF EXISTS users CASCADE;

-- new users table:
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    first       VARCHAR(255) NOT NULL CHECK (first != ''),
    last        VARCHAR(255) NOT NULL CHECK (last != ''),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
