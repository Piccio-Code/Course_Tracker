package models

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
)

type CourseModel struct {
	DB *pgxpool.Pool
}

type Course struct {
	Name     string
	Duration int
	Parts    []CoursePart
}

type CoursePart struct {
	Name     string
	Duration int
	Files    []CourseFile
}

type CourseFile struct {
	Name     string
	URL      string
	Format   string
	Duration int
}

type CourseFolder struct {
	Name string
	URL  string
}

func (m *CourseModel) InsertCourse(course Course) (pgconn.CommandTag, error) {

	log.Println(course.Name)

	query := `INSERT INTO courses(name, duration) VALUES ($1, $2);`

	tx, err := m.DB.Begin(context.Background())

	if err != nil {
		return pgconn.CommandTag{}, err
	}

	defer tx.Rollback(context.Background())

	test, err := tx.Exec(context.Background(), query, course.Name, course.Duration)

	if err != nil {
		return pgconn.CommandTag{}, err
	}

	query = `SELECT id 
           FROM courses
           WHERE name=$1`

	var id int

	err = tx.QueryRow(context.Background(), query, course.Name).Scan(&id)

	if err != nil {
		return pgconn.CommandTag{}, err
	}

	for _, part := range course.Parts {
		err = m.InsertPartInTx(tx, part, id)

		if err != nil {
			return pgconn.CommandTag{}, err
		}
	}

	err = tx.Commit(context.Background())

	if err != nil {
		return pgconn.CommandTag{}, err
	}

	return test, nil
}

func (m *CourseModel) InsertPart(part CoursePart, courseID int) error {
	tx, err := m.DB.Begin(context.Background())
	if err != nil {
		return err
	}
	defer tx.Rollback(context.Background())

	err = m.InsertPartInTx(tx, part, courseID)
	if err != nil {
		return err
	}

	return tx.Commit(context.Background())
}

func (m *CourseModel) InsertPartInTx(tx pgx.Tx, part CoursePart, courseID int) error {
	query := `INSERT INTO courseparts(name, duration, course_id) VALUES ($1, $2, $3)`

	_, err := tx.Exec(context.Background(), query, part.Name, part.Duration, courseID)

	if err != nil {
		return err
	}

	query = `SELECT id 
           FROM courseparts
           WHERE name=$1 AND course_id=$2`

	var id int

	err = tx.QueryRow(context.Background(), query, part.Name, courseID).Scan(&id)

	if err != nil {
		return err
	}

	for _, file := range part.Files {
		err = m.InsertFileInTx(tx, file, id)

		if err != nil {
			return err
		}
	}

	return nil
}

func (m *CourseModel) InsertFile(file CourseFile, partID int) error {
	tx, err := m.DB.Begin(context.Background())
	if err != nil {
		return err
	}
	defer tx.Rollback(context.Background())

	err = m.InsertFileInTx(tx, file, partID)
	if err != nil {
		return err
	}

	return tx.Commit(context.Background())
}

func (m *CourseModel) InsertFileInTx(tx pgx.Tx, file CourseFile, partID int) error {
	query := `INSERT INTO coursefiles(name, url, format, duration, part_id) VALUES ($1, $2, $3, $4, $5)`

	_, err := tx.Exec(context.Background(), query, file.Name, file.URL, file.Format, file.Duration, partID)

	if err != nil {
		return err
	}

	return nil
}
