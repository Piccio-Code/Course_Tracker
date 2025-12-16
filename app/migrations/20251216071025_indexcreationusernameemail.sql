-- +goose Up
-- +goose StatementBegin
CREATE INDEX username_idx
    ON users(username);

CREATE INDEX email_idx
    ON users(email);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS username_idx;

DROP INDEX IF EXISTS email_idx;
-- +goose StatementEnd
