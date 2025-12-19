package main

import (
	"github.com/ajg/form"
	"net/http"
)

type CurrentUserId string

const CurrentUserIdKey = CurrentUserId("AuthenticatedUserKey")
const AuthenticatedUserId = "AuthenticatedUserId"

type CourseForm struct {
	URL  string `form:"link"`
	Name string `form:"name"`
}

type UserForm struct {
	Username string `form:"username"`
	Email    string `form:"email"`
	Password string `form:"password"`
}

type UserModifyForm struct {
	Username string `form:"username"`
	Email    string `form:"email"`
}

func (app *Application) GetCourseForm(r *http.Request) (courseForm CourseForm, err error) {
	decoder := form.NewDecoder(r.Body)

	if err := decoder.Decode(&courseForm); err != nil {
		app.ErrorLog.Println(err)
		return CourseForm{}, err
	}

	return courseForm, nil
}

func (app *Application) GetUserFrom(r *http.Request) (user UserForm, err error) {
	d := form.NewDecoder(r.Body)

	if err := d.Decode(&user); err != nil {
		app.ErrorLog.Println(err)
		return UserForm{}, err
	}

	return user, nil
}

func (app *Application) GetUserModifyForm(r *http.Request) (newUserOptions UserModifyForm, err error) {
	d := form.NewDecoder(r.Body)

	if err := d.Decode(&newUserOptions); err != nil {
		app.ErrorLog.Println(err)
		return UserModifyForm{}, err
	}

	return newUserOptions, nil
}
