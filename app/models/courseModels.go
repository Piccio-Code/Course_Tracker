package models

import (
	"context"
	"encoding/json"
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CourseModel struct {
	DB *pgxpool.Pool
}

func (m *CourseModel) InsertCourse(ctx context.Context, course *Course) (id int, err error) {

	tx, err := m.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	stmt := `INSERT INTO course(course_resources) VALUES ($1) returning id`

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
