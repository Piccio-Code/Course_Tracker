package main

import (
	"github.com/justinas/alice"
	"net/http"
)

func (app *Application) routes() http.Handler {
	mux := http.NewServeMux()

	standardMiddleware := alice.New(app.SessionManager.LoadAndSave, app.Logger, app.enableCORS)
	protect := alice.New(app.RequireAuthentication)

	mux.Handle("POST /courses", protect.ThenFunc(app.CreateCourse))

	mux.Handle("GET /courses", protect.ThenFunc(app.ViewCourses))
	mux.Handle("GET /courses/{id}", protect.ThenFunc(app.ViewCourse))

	mux.Handle("PUT /courses/{id}", protect.ThenFunc(app.UpdateCourse))

	mux.Handle("DELETE /courses/{id}", protect.ThenFunc(app.DeleteCourse))

	mux.HandleFunc("POST /auth/signup", app.Signup)
	mux.HandleFunc("POST /auth/login", app.Login)
	mux.Handle("POST /auth/logout", protect.ThenFunc(app.Logout))

	return standardMiddleware.Then(mux)
}
