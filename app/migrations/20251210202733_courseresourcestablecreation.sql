-- +goose Up
-- +goose StatementBegin
CREATE TABLE Courses (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Duration INT
);

CREATE TABLE CourseParts (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Duration INT NOT NULL,
    Course_id INT NOT NULL,
    FOREIGN KEY (Course_id) REFERENCES Courses(ID)
);

CREATE TABLE CourseFiles (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    URL VARCHAR(999) NOT NULL,
    Format VARCHAR(255) NOT NULL,
    Duration INT,
    Part_id INT NOT NULL,
    FOREIGN KEY (Part_id) REFERENCES CourseParts(ID)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS CourseFiles;
DROP TABLE IF EXISTS CourseParts;
DROP TABLE IF EXISTS Courses;
-- +goose StatementEnd