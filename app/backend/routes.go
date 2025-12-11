package main

import "net/http"

func (app *Application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /courses", app.CreateCourse)

	mux.HandleFunc("GET /courses", app.ViewCourses)
	mux.HandleFunc("GET /courses/{id}", app.ViewCourses)

	return mux
}
