package models

import (
	"context"
	"encoding/json"
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type CourseModel struct {
	DB *pgxpool.Pool
}

type CourseResponse struct {
	ID              int       `json:"id"`
	CourseResources Course    `json:"courseResources"`
	Created         time.Time `json:"created"`
	LastUpdated     time.Time `json:"lastUpdated"`
}

type CoursesListResponse struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Created     time.Time `json:"created"`
	LastUpdated time.Time `json:"lastUpdated"`
}

func (m *CourseModel) Insert(ctx context.Context, course *Course) (id int, err error) {

	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO courses(course_resources) VALUES ($1) returning id`

	data, err := json.Marshal(course)

	if err != nil {
		return 0, err
	}

	err = tx.QueryRow(ctx, stmt, data).Scan(&id)

	if err != nil {
		return 0, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *CourseModel) Get(ctx context.Context, id int) (course CourseResponse, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return CourseResponse{}, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, course_resources, created_at, last_updated FROM courses WHERE id = $1`

	var data []byte

	err = tx.QueryRow(ctx, stmt, id).Scan(&course.ID, &data, &course.Created, &course.LastUpdated)

	if err != nil {
		return CourseResponse{}, err
	}

	err = json.Unmarshal(data, &course.CourseResources)

	if err != nil {
		return CourseResponse{}, err
	}

	return course, nil
}

func (m *CourseModel) List(ctx context.Context) (courses []CoursesListResponse, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, course_resources->'name', created_at, last_updated FROM courses`

	rows, err := tx.Query(ctx, stmt)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var course CoursesListResponse
		var courseName []byte

		err := rows.Scan(&course.ID, &courseName, &course.Created, &course.LastUpdated)

		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(courseName, &course.Name)

		if err != nil {
			return nil, err
		}

		courses = append(courses, course)
	}

	return courses, nil
}

func (m *CourseModel) Delete(ctx context.Context, id int) error {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `DELETE FROM courses WHERE id = $1`

	_, err = tx.Exec(ctx, stmt, id)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (m *CourseModel) Update(ctx context.Context, course *Course, id int) (updatedId int, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `UPDATE courses
			 SET course_resources = $1, last_updated = current_timestamp
			 WHERE id = $2 RETURNING id`

	courseResourcesJson, err := json.Marshal(course)

	if err != nil {
		return 0, err
	}

	err = tx.QueryRow(ctx, stmt, courseResourcesJson, id).Scan(&updatedId)

	if err != nil {
		return 0, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return 0, err
	}

	return updatedId, nil
}
