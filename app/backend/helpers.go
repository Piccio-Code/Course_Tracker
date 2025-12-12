package main

import (
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"github.com/ajg/form"
	"net/http"
)

type CourseForm struct {
	URL string `form:"url"`
}

func (app *Application) GetCourseFormLink(r *http.Request) (course *Course, err error) {
	decoder := form.NewDecoder(r.Body)

	var courseForm CourseForm

	if err := decoder.Decode(&courseForm); err != nil {
		app.ErrorLog.Println(err)
		return nil, err
	}

	return app.Onedrive.NewCourse(courseForm.URL)
}
