-- +goose Up
-- +goose StatementBegin
ALTER TABLE IF EXISTS courses
    ADD COLUMN URL VARCHAR(255) UNIQUE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE IF EXISTS courses
    DROP URL;
-- +goose StatementEnd
