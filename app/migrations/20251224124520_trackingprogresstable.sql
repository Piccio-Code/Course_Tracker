-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users_progress (
    id SERIAL PRIMARY KEY NOT NULL,
    time_watched INT NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    resource_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users_progress;
-- +goose StatementEnd
