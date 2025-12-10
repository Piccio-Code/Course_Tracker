package main

import (
	"context"
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

type Application struct {
	Onedrive *Onedrive
	ErrorLog *log.Logger
	InfoLog  *log.Logger
	DB       *pgxpool.Pool
}

func main() {
	errorLog := log.New(os.Stderr, "ERROR: \t", log.Ltime|log.Llongfile)
	infoLog := log.New(os.Stdout, "INFO: \t", log.Ltime)

	err := godotenv.Load("app/.env")

	if err != nil {
		errorLog.Fatal(err)
	}

	onedrive, err := NewOnedrive()

	if err != nil {
		errorLog.Fatal(err)
	}

	dbPool, err := ConnectToDb(os.Getenv("DATABASE_URL"))

	if err != nil {
		errorLog.Fatal(err)
	}

	app := Application{
		Onedrive: onedrive,
		ErrorLog: errorLog,
		InfoLog:  infoLog,
		DB:       dbPool,
	}

	srv := http.Server{
		Addr:     ":8080",
		Handler:  app.routes(),
		ErrorLog: app.ErrorLog,
	}

	log.Println("Server starting on http://localhost:8080")
	log.Fatal(srv.ListenAndServe())
}

func ConnectToDb(dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(context.Background(), dsn)

	if err != nil {
		return nil, err
	}

	if err = pool.Ping(context.Background()); err != nil {
		return nil, err
	}

	return pool, nil
}
