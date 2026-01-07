-- +goose Up
-- +goose StatementBegin
ALTER TABLE courses
    ALTER COLUMN user_id TYPE VARCHAR(255);

ALTER TABLE users_progress
    ALTER COLUMN user_id TYPE VARCHAR(255);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE courses
    ALTER COLUMN user_id TYPE INT;

ALTER TABLE users_progress
    ALTER COLUMN user_id TYPE INT;
-- +goose StatementEnd
