package main

import "net/http"

func (app *Application) routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /courses", app.CreateCourse)

	mux.HandleFunc("GET /courses", app.ViewCourses)
	mux.HandleFunc("GET /courses/{id}", app.ViewCourse)

	mux.HandleFunc("PUT /courses/{id}", app.UpdateCourse)

	mux.HandleFunc("DELETE /courses/{id}", app.DeleteCourse)

	return app.Logger(mux)
}
