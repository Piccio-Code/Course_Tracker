package main

import (
	. "github.com/Piccio-Code/Course_Tracker/Wrapper"
	"github.com/ajg/form"
	"net/http"
)

type CurrentUserId string

const CurrentUserIdKey = CurrentUserId("AuthenticatedUserKey")
const AuthenticatedUserId = "AuthenticatedUserId"

type CourseForm struct {
	URL  string `form:"url"`
	Name string `form:"name"`
}

type UserForm struct {
	Username string `form:"username"`
	Email    string `form:"email"`
	Password string `form:"password"`
}

func (app *Application) GetCourseFormLink(r *http.Request) (course *Course, err error) {
	decoder := form.NewDecoder(r.Body)

	var courseForm CourseForm

	if err := decoder.Decode(&courseForm); err != nil {
		app.ErrorLog.Println(err)
		return nil, err
	}

	return app.Onedrive.NewCourse(courseForm.URL, courseForm.Name)
}

func (app *Application) GetUserFrom(r *http.Request) (user UserForm, err error) {
	d := form.NewDecoder(r.Body)

	if err := d.Decode(&user); err != nil {
		app.ErrorLog.Println(err)
		return UserForm{}, err
	}

	return user, nil
}
