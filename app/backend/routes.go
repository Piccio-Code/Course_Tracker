package main

import (
	"github.com/justinas/alice"
	"net/http"
)

func (app *Application) routes() http.Handler {
	mux := http.NewServeMux()

	standardMiddleware := alice.New(app.Cors.Handler, app.SecureHeaders, app.SessionManager.LoadAndSave, app.Logger)
	protect := alice.New(app.RequireAuthentication)

	mux.HandleFunc("POST /auth/signup", app.Signup)
	mux.HandleFunc("POST /auth/login", app.Login)
	mux.Handle("POST /auth/logout", protect.ThenFunc(app.Logout))

	mux.Handle("GET /user", protect.ThenFunc(app.GetUser))
	mux.Handle("PUT /user", protect.ThenFunc(app.ModifyUser))

	mux.Handle("POST /courses", protect.ThenFunc(app.CreateCourse))

	mux.Handle("GET /courses", protect.ThenFunc(app.ViewCourses))
	mux.Handle("GET /courses/{id}", protect.ThenFunc(app.ViewCourse))

	mux.Handle("PUT /courses/{id}", protect.ThenFunc(app.UpdateCourse))

	mux.Handle("DELETE /courses/{id}", protect.ThenFunc(app.DeleteCourse))

	return standardMiddleware.Then(mux)
}
