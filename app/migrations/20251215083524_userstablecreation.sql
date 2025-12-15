-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    ID serial NOT NULL,
    Username varchar(255) NOT NULL UNIQUE,
    Email varchar(255) NOT NULL UNIQUE,
    Password varchar(255) NOT NULL
);

CREATE INDEX email_idx ON users(Email);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users
-- +goose StatementEnd
