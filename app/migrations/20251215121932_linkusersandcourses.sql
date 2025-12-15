-- +goose Up
-- +goose StatementBegin
ALTER TABLE courses
    ADD COLUMN user_id INT;

ALTER TABLE courses
    ADD CONSTRAINT user_fk FOREIGN KEY (user_id) REFERENCES users(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE IF EXISTS courses
    DROP CONSTRAINT user_fk;

ALTER TABLE IF EXISTS courses
    DROP user_id;
-- +goose StatementEnd
