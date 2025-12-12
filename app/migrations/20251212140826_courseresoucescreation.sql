-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS Course (
    ID SERIAL PRIMARY KEY NOT NULL,
    course_resources JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS Course
-- +goose StatementEnd
