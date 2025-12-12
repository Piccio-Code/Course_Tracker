package main

import (
	"fmt"
	"github.com/ajg/form"
	"net/http"
)

type CourseForm struct {
	URL string `form:"url"`
}

func (app *Application) CreateCourse(w http.ResponseWriter, r *http.Request) {
	decoder := form.NewDecoder(r.Body)

	var courseForm CourseForm

	if err := decoder.Decode(&courseForm); err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error deconding the body", http.StatusBadRequest)
	}

	course, err := app.Onedrive.NewCourse(courseForm.URL)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from Onedrive API", http.StatusBadRequest)
		return
	}

	id, err := app.courseModel.InsertCourse(r.Context(), course)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error inserting the course", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "ID of inserted course: %d", id)
}

func (app *Application) ViewCourses(w http.ResponseWriter, r *http.Request) {
	//courses, err := app.courseModel.GetCourses(r.Context())
	//
	//if err != nil {
	//	app.ErrorLog.Println(err)
	//	http.Error(w, "Error getting courses", http.StatusBadRequest)
	//	return
	//}
	//
	//fmt.Fprintln(w, courses)
}

func (app *Application) ViewCourse(w http.ResponseWriter, r *http.Request) {
	//courses, err := app.courseModel.GetCourses(r.Context())
	//
	//if err != nil {
	//	app.ErrorLog.Println(err)
	//	http.Error(w, "Error getting courses", http.StatusBadRequest)
	//	return
	//}
	//
	//fmt.Fprintln(w, courses)
}
