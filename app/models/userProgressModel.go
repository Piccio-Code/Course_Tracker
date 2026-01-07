package models

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"strings"
)

type ProgressModel struct {
	DB *pgxpool.Pool
}

type ResourceProgress struct {
	ID          int    `json:"id,omitempty"`
	TimeWatched int    `json:"time_watched,omitempty"`
	Completed   bool   `json:"completed,omitempty"`
	URL         string `json:"url,omitempty"`
}

type Progress struct {
	CourseName      string `json:"course_name,omitempty"`
	CourseId        int    `json:"course_id,omitempty"`
	CourseTotalTime int    `json:"course_total_time,omitempty"`
	TimeWatched     int    `json:"time_watched,omitempty"`
}

func (p *ProgressModel) Insert(ctx context.Context, courseId int, userId string, watchedTimeMills int, completed bool, url string) error {
	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO users_progress(time_watched, completed, course_id, user_id, resource_url) VALUES ($1, $2, $3, $4, $5)`

	_, err = tx.Exec(ctx, stmt, watchedTimeMills, completed, courseId, userId, url)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *ProgressModel) Update(ctx context.Context, courseId int, userId string, watchedTimeMills int, completed bool, url string) error {
	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `UPDATE users_progress 
			 SET time_watched = $1, completed = $2
			 WHERE course_id = $3 AND user_id = $4 AND resource_url = $5`

	_, err = tx.Exec(ctx, stmt, watchedTimeMills, completed, courseId, userId, url)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *ProgressModel) Delete(ctx context.Context, courseId int, userId string, url string) error {
	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `DELETE FROM users_progress WHERE course_id = $1 AND user_id = $2 AND resource_url = $3`

	_, err = tx.Exec(ctx, stmt, courseId, userId, url)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *ProgressModel) GetCourseProgress(ctx context.Context, courseId int, userId string) (courseProgress []ResourceProgress, err error) {

	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, time_watched, completed, resource_url
			 FROM users_progress
			 WHERE user_id=$1 AND course_id=$2`

	rows, err := tx.Query(ctx, stmt, userId, courseId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var progress ResourceProgress

		err := rows.Scan(&progress.ID, &progress.TimeWatched, &progress.Completed, &progress.URL)

		if err != nil {
			return nil, err
		}

		courseProgress = append(courseProgress, progress)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courseProgress, nil
}

func (p *ProgressModel) GetProgresses(ctx context.Context, userId string) (userProgress []Progress, err error) {

	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT c.course_resources->'name', sum(time_watched), c.id, c.course_resources->'duration'
				FROM users_progress p
				JOIN courses c on c.id = p.course_id
				WHERE p.user_id=$1
			GROUP BY c.course_resources->'name', c.id, c.course_resources->'duration'`

	rows, err := tx.Query(ctx, stmt, userId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var progress Progress

		err := rows.Scan(&progress.CourseName, &progress.TimeWatched, &progress.CourseId, &progress.CourseTotalTime)

		if err != nil {
			return nil, err
		}

		progress.CourseName = strings.Replace(progress.CourseName, "\"", "", -1)

		userProgress = append(userProgress, progress)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return userProgress, nil
}
