package main

import (
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"log"
	"net/http"
	"os"
)

type Application struct {
	onedrive *Onedrive
	errorLog *log.Logger
	infoLog  *log.Logger
}

func main() {
	onedrive, err := NewOnedrive()
	errorLog := log.New(os.Stderr, "ERROR: \t", log.Ltime|log.Llongfile)
	infoLog := log.New(os.Stdout, "INFO: \t", log.Ltime)

	if err != nil {
		log.Fatal(err)
	}

	app := Application{
		onedrive: onedrive,
		errorLog: errorLog,
		infoLog:  infoLog,
	}

	srv := http.Server{
		Addr:     ":8080",
		Handler:  app.routes(),
		ErrorLog: app.errorLog,
	}

	log.Println("Server starting on http://localhost:8080")
	log.Fatal(srv.ListenAndServe())
}
