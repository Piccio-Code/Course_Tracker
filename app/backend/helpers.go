package main

import (
	"github.com/ajg/form"
	"net/http"
)

type CurrentUserKey string

const CurrentUser = CurrentUserKey("AuthenticatedUserKey")

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

type ProgressForm struct {
	WatchedTimeMills int    `form:"watched_time_mills"`
	Completed        bool   `form:"completed"`
	URL              string `form:"url"`
}

func (app *Application) GetProgressForm(r *http.Request) (progressForm ProgressForm, err error) {
	decoder := form.NewDecoder(r.Body)

	if err := decoder.Decode(&progressForm); err != nil {
		app.ErrorLog.Println(err)
		return ProgressForm{}, err
	}

	return progressForm, nil
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
