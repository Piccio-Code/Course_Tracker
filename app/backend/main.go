package main

import (
	"context"
	"flag"
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	. "github.com/Piccio-Code/Course_Tracker/app/models"
	"github.com/alexedwards/scs/pgxstore"
	"github.com/alexedwards/scs/v2"
	"github.com/fatih/color"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"time"
)

type Application struct {
	Onedrive       *Onedrive
	ErrorLog       *log.Logger
	InfoLog        *log.Logger
	CourseModel    *CourseModel
	UserModel      *UserModel
	SessionManager *scs.SessionManager
	Cors           *cors.Cors
}

func main() {

	onedriveFlag := flag.Bool("onedrive", false, "This flag will connect with onedrive API")
	devFlag := flag.Bool("dev", false, "This flag will disable secure cookie only sent by HTTPS, use only for production")

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
		infoLog.Println(color.RedString("You have disable onedrive API connection"))
	}

	dbPool, err := ConnectToDb(os.Getenv("DATABASE_URL"))

	if err != nil {
		errorLog.Fatal(err)
	}

	sessionManager := scs.New()
	sessionManager.Store = pgxstore.New(dbPool)
	sessionManager.Lifetime = 12 * time.Hour
	sessionManager.Cookie.HttpOnly = true
	sessionManager.Cookie.Persist = true
	sessionManager.Cookie.Secure = !*devFlag              // allow HTTP
	sessionManager.Cookie.SameSite = http.SameSiteLaxMode // Lax or None

	corsOptions := cors.Options{
		AllowedOrigins:      []string{"https://coursetracker.it", "http://192.168.1.3:3000", "http://localhost:3000", "http://10.248.48.196:3000"},
		AllowCredentials:    true,
		AllowPrivateNetwork: true,
	}

	app := Application{
		Onedrive:       onedrive,
		ErrorLog:       errorLog,
		InfoLog:        infoLog,
		CourseModel:    &CourseModel{DB: dbPool},
		UserModel:      &UserModel{DB: dbPool},
		SessionManager: sessionManager,
		Cors:           cors.New(corsOptions),
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
