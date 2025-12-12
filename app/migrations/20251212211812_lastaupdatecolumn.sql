-- +goose Up
-- +goose StatementBegin
ALTER TABLE courses
ADD COLUMN last_updated TIMESTAMP DEFAULT current_timestamp;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE courses
DROP COLUMN IF EXISTS last_updated
-- +goose StatementEnd
