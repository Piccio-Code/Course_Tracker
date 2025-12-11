package models

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CourseModel struct {
	DB *pgxpool.Pool
}

type Course struct {
	ID       int
	Name     string
	Duration int
	Parts    []CoursePart
	Files    []CourseFile
}

type CoursePart struct {
	Name     string
	Duration int
	SubParts []CoursePart
	Files    []CourseFile
}

type CourseFile struct {
	Name     string
	URL      string
	Format   string
	Duration int
}

func (m *CourseModel) GetCourses(ctx context.Context) (courses []Course, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	query := `SELECT id, name, duration FROM courses`

	rows, err := tx.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var currentCourse Course

		err = rows.Scan(&currentCourse.ID, &currentCourse.Name, &currentCourse.Duration)

		if err != nil {
			return nil, err
		}

		courses = append(courses, currentCourse)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}

func (m *CourseModel) InsertCourse(ctx context.Context, course *Course) (int, error) {
	query := `INSERT INTO courses(name, duration) VALUES ($1, $2) RETURNING id;`

	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	var id int

	err = tx.QueryRow(ctx, query, course.Name, course.Duration).Scan(&id)

	if err != nil {
		return 0, err
	}

	for _, part := range course.Parts {

		err := m.InsertPart(ctx, tx, part, id, 0)

		if err != nil {
			return 0, err
		}

	}

	for _, file := range course.Files {
		err := m.InsertFiles(ctx, tx, file, 0, id)

		if err != nil {
			return 0, err
		}
	}

	return id, tx.Commit(ctx)
}

func (m *CourseModel) InsertPart(ctx context.Context, tx pgx.Tx, part CoursePart, courseId int, partId int) (err error) {
	query := `INSERT INTO courseparts(name, duration, course_id, part_id) 
				  VALUES ($1, $2, $3, $4) returning id`

	var id int

	if partId == 0 {
		err = tx.QueryRow(ctx, query, part.Name, part.Duration, courseId, nil).Scan(&id)
	}

	if courseId == 0 {
		err = tx.QueryRow(ctx, query, part.Name, part.Duration, nil, partId).Scan(&id)
	}

	if err != nil {
		return err
	}

	if part.SubParts == nil {
		for _, file := range part.Files {
			err = m.InsertFiles(ctx, tx, file, id, 0)

			if err != nil {
				return err
			}
		}

		return nil
	}

	for _, subPart := range part.SubParts {
		err := m.InsertPart(ctx, tx, subPart, 0, id)

		if err != nil {
			return err
		}
	}

	return nil
}

func (m *CourseModel) InsertFiles(ctx context.Context, tx pgx.Tx, file CourseFile, partId int, courseId int) error {
	query := `INSERT INTO coursefiles(name, url, format, duration, part_id, course_id)
			  VALUES ($1, $2, $3, $4, $5, $6)`

	var err error

	if partId == 0 {
		_, err = tx.Exec(ctx, query, file.Name, file.URL, file.Format, file.Duration, nil, courseId)
	}

	if courseId == 0 {
		_, err = tx.Exec(ctx, query, file.Name, file.URL, file.Format, file.Duration, partId, nil)
	}

	if err != nil {
		return fmt.Errorf("error inserting the file %s, in to the part %v, course %v\n SQL err: %v", file.Name, partId, courseId, err)
	}

	return nil
}
