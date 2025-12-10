package main

import "net/http"

func (app *Application) routes() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /courses/in_folder", app.GetCoursesInFolder)
	mux.HandleFunc("POST /courses/add_folder", app.AddCourseFolder)

	return mux
}
