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
	Duration    int       `json:"duration"`
	Created     time.Time `json:"created"`
	LastUpdated time.Time `json:"lastUpdated"`
}

func (m *CourseModel) Insert(ctx context.Context, course *Course, userId int) (id int, err error) {

	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO courses(course_resources, user_id) VALUES ($1, $2) returning id`

	data, err := json.Marshal(course)

	if err != nil {
		return 0, err
	}

	err = tx.QueryRow(ctx, stmt, data, userId).Scan(&id)

	if err != nil {
		return 0, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *CourseModel) Get(ctx context.Context, id int, userId int) (course CourseResponse, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return CourseResponse{}, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, course_resources, created_at, last_updated FROM courses WHERE id = $1 AND user_id = $2`

	var data []byte

	err = tx.QueryRow(ctx, stmt, id, userId).Scan(&course.ID, &data, &course.Created, &course.LastUpdated)

	if err != nil {
		return CourseResponse{}, err
	}

	err = json.Unmarshal(data, &course.CourseResources)

	if err != nil {
		return CourseResponse{}, err
	}

	return course, nil
}

func (m *CourseModel) List(ctx context.Context, userId int) (courses []CoursesListResponse, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, course_resources->'name', course_resources->'duration', created_at, last_updated FROM courses WHERE user_id = $1`

	rows, err := tx.Query(ctx, stmt, userId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var course CoursesListResponse
		var courseName []byte
		var courseDuration []byte

		err := rows.Scan(&course.ID, &courseName, &courseDuration, &course.Created, &course.LastUpdated)

		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(courseName, &course.Name)

		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(courseDuration, &course.Duration)

		if err != nil {
			return nil, err
		}

		courses = append(courses, course)
	}

	return courses, nil
}

func (m *CourseModel) Delete(ctx context.Context, id int, userId int) error {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `DELETE FROM users_progress WHERE course_id = $1`

	_, err = tx.Exec(ctx, stmt, id)

	if err != nil {
		return err
	}

	stmt = `DELETE FROM courses WHERE id = $1 AND user_id = $2`

	_, err = tx.Exec(ctx, stmt, id, userId)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (m *CourseModel) Update(ctx context.Context, course *Course, id int, userId int) (updatedId int, err error) {
	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `UPDATE courses
			 SET course_resources = $1, last_updated = current_timestamp
			 WHERE id = $2 AND user_id = $3
			 RETURNING id`

	courseResourcesJson, err := json.Marshal(course)

	if err != nil {
		return 0, err
	}

	err = tx.QueryRow(ctx, stmt, courseResourcesJson, id, userId).Scan(&updatedId)

	if err != nil {
		return 0, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return 0, err
	}

	return updatedId, nil
}
