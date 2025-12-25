package models

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
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

func (p *ProgressModel) Complete(ctx context.Context, courseId, userId int, url string) error {
	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO users_progress(completed, course_id, user_id, resource_url) VALUES ($1, $2, $3, $4)`

	_, err = tx.Exec(ctx, stmt, true, courseId, userId, url)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *ProgressModel) Update(ctx context.Context, courseId, userId, watchedTimeMills int, url string) error {
	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO users_progress(time_watched, course_id, user_id, resource_url) VALUES ($1, $2, $3, $4)`

	_, err = tx.Exec(ctx, stmt, watchedTimeMills, courseId, userId, url)

	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (p *ProgressModel) Remove(ctx context.Context, courseId, userId int, url string) error {
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

func (p *ProgressModel) GetCourseProgress(ctx context.Context, courseId, userId int) (courseProgress []ResourceProgress, err error) {

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

func (p *ProgressModel) GetProgresses(ctx context.Context, userId int) (progressMap map[string][]ResourceProgress, err error) {

	tx, err := p.DB.Begin(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT p.id, time_watched, completed, resource_url, c.course_resources->'name'
			 FROM users_progress p
			 JOIN courses c on c.id = p.course_id
			 WHERE p.user_id=$1`

	rows, err := tx.Query(ctx, stmt, userId)

	if err != nil {
		return nil, err
	}

	progressMap = make(map[string][]ResourceProgress)

	for rows.Next() {
		var course string
		var progress ResourceProgress

		err := rows.Scan(&progress.ID, &progress.TimeWatched, &progress.Completed, &progress.URL, &course)

		if err != nil {
			return nil, err
		}

		progressMap[course] = append(progressMap[course], progress)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return progressMap, nil
}
