package main

import (
	"context"
	"flag"
	"fmt"
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	. "github.com/Piccio-Code/Course_Tracker/app/models"
	"github.com/fatih/color"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

type Application struct {
	BaseUrl string

	Onedrive *Onedrive

	ErrorLog *log.Logger
	InfoLog  *log.Logger

	CourseModel   *CourseModel
	ProgressModel *ProgressModel
	Cors          *cors.Cors
}

func main() {

	onedriveFlag := flag.Bool("onedrive", false, "This flag will connect with onedrive API")
	devFlag := flag.Bool("dev", false, "This flag will disable secure cookie only sent by HTTPS, use only for production")
	baseUrl := flag.String("baseUrl", "http://localhost:3000", "This is used for CORS and authentication")

	flag.Parse()

	errorLog := log.New(os.Stderr, "ERROR: \t", log.Ltime|log.Llongfile)
	infoLog := log.New(os.Stdout, "INFO: \t", log.Ltime)

	err := godotenv.Load("app/.env")

	if err != nil {
		errorLog.Fatal(err)
	}

	var onedrive *Onedrive

	if *onedriveFlag {
		onedrive, err = NewOnedrive()

		if err != nil {
			errorLog.Fatal(err)
		}

	} else {
		infoLog.Println(color.RedString("You have disable onedrive API connection."))
	}

	if *devFlag {
		infoLog.Println(color.RedString("You are in development mode."))
	} else {
		infoLog.Println(color.GreenString("You are in production mode"))
	}

	infoLog.Println(color.GreenString(fmt.Sprintf("The base url is: %v", *baseUrl)))

	dbPool, err := ConnectToDb(os.Getenv("DATABASE_URL"))

	if err != nil {
		errorLog.Fatal(err)
	}

	corsOptions := cors.Options{
		AllowedOrigins:      []string{"http://localhost:3000", "https://coursetracker.it", "https://www.coursetracker.it"},
		AllowCredentials:    true,
		AllowPrivateNetwork: true,
		AllowedMethods:      []string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"},
		AllowedHeaders:      []string{"Authorization", "Content-Type", "Accept"},
		ExposedHeaders:      []string{"Content-Length"},
		MaxAge:              300, // Cache preflight requests for 5 minutes
	}

	app := Application{
		BaseUrl:       *baseUrl,
		Onedrive:      onedrive,
		ErrorLog:      errorLog,
		InfoLog:       infoLog,
		CourseModel:   &CourseModel{DB: dbPool},
		ProgressModel: &ProgressModel{DB: dbPool},
		Cors:          cors.New(corsOptions),
	}

	srv := http.Server{
		Addr:     ":8080",
		Handler:  app.routes(),
		ErrorLog: app.ErrorLog,
	}

	app.InfoLog.Println("Server starting on http://localhost:8080")
	app.ErrorLog.Fatal(srv.ListenAndServe())
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
