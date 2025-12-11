-- +goose Up
-- +goose StatementBegin
ALTER TABLE courseparts
    ADD COLUMN part_id INT NULL;

ALTER TABLE courseparts
    ADD CONSTRAINT fk_part_id FOREIGN KEY (part_id) REFERENCES courseparts(id);

ALTER TABLE coursefiles
    ADD COLUMN course_id INT NULL;

ALTER TABLE coursefiles
    ADD CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES courses(id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE courseparts
    DROP CONSTRAINT fk_part_id;

ALTER TABLE coursefiles
    DROP CONSTRAINT fk_course_id;

ALTER TABLE courseparts
    DROP part_id;

ALTER TABLE coursefiles
    DROP course_id;


-- +goose StatementEnd
