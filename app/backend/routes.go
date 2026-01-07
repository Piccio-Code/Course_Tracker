package main

import (
	"github.com/justinas/alice"
	"net/http"
)

func (app *Application) routes() http.Handler {
	mux := http.NewServeMux()

	standardMiddleware := alice.New(app.Cors.Handler, app.SecureHeaders, app.Logger)
	protect := alice.New(app.RequireAuthentication)

	mux.Handle("POST /courses", protect.ThenFunc(app.CreateCourse))

	mux.Handle("GET /courses", protect.ThenFunc(app.ViewCourses))
	mux.Handle("GET /courses/{id}", protect.ThenFunc(app.ViewCourse))

	mux.Handle("PUT /courses/{id}", protect.ThenFunc(app.UpdateCourse))

	mux.Handle("DELETE /courses/{id}", protect.ThenFunc(app.DeleteCourse))

	mux.Handle("POST /progress/{id}", protect.ThenFunc(app.InsertCourseProgress))

	mux.Handle("GET /progress", protect.ThenFunc(app.GetProgress))
	mux.Handle("GET /progress/{id}", protect.ThenFunc(app.GetCourseProgress))

	mux.Handle("PUT /progress/{id}", protect.ThenFunc(app.UpdateCourseProgress))

	mux.Handle("DELETE /progress/{id}", protect.ThenFunc(app.DeleteCourseProgress))

	return standardMiddleware.Then(mux)
}
