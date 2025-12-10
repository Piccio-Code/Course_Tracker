package main

import "net/http"

func (app *Application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /courses", app.CreateCourse)

	return mux
}
