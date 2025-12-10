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
	}

	insertCourse, err := app.courseModel.InsertCourse(*course)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error inserting the course", http.StatusBadRequest)
	}

	fmt.Fprintf(w, "%v", insertCourse)
}
