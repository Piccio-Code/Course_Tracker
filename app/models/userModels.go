package models

import (
	"context"
	. "github.com/Piccio-Code/Course_Tracker/app/customErrors"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type UserModel struct {
	DB *pgxpool.Pool
}

type User struct {
	ID       int
	Username string
	Email    string
	Password string
}

func (u *UserModel) Insert(ctx context.Context, user User) (id int, err error) {

	tx, err := u.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id`

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)

	err = tx.QueryRow(ctx, stmt, user.Username, user.Email, hashedPassword).Scan(&id)

	if err != nil {
		return 0, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func (u *UserModel) Get(ctx context.Context, user User) (id int, err error) {

	tx, err := u.DB.Begin(ctx)

	if err != nil {
		return 0, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT id, password FROM users WHERE (email=$1 OR username=$2)`

	var hashedPassword []byte

	err = tx.QueryRow(ctx, stmt, user.Email, user.Username).Scan(&id, &hashedPassword)

	if err != nil {
		return 0, err
	}

	success := bcrypt.CompareHashAndPassword(hashedPassword, []byte(user.Password))

	if success != nil {
		return 0, InvalidCredentials
	}

	return id, nil
}

func (u *UserModel) Exist(ctx context.Context, id int) (exist bool, err error) {

	tx, err := u.DB.Begin(ctx)

	if err != nil {
		return false, err
	}

	defer tx.Rollback(ctx)

	stmt := `SELECT exists (SELECT * FROM users WHERE id=$1)`

	err = tx.QueryRow(ctx, stmt, id).Scan(&exist)

	if err != nil {
		return false, err
	}

	return exist, nil
}
