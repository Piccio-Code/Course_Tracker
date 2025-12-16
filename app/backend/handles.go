package main

import (
	"encoding/json"
	"fmt"
	. "github.com/Piccio-Code/Course_Tracker/app/models"
	"net/http"
	"strconv"
)

func (app *Application) Signup(w http.ResponseWriter, r *http.Request) {
	userForm, err := app.GetUserFrom(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error parsing the body"), http.StatusBadRequest)
		return
	}

	id, err := app.UserModel.Insert(r.Context(), User{Username: userForm.Username, Email: userForm.Email, Password: userForm.Password})

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error signing up"), http.StatusBadRequest)
		return
	}

	err = app.SessionManager.RenewToken(r.Context())

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error renewing the token up"), http.StatusInternalServerError)
		return
	}

	app.SessionManager.Put(r.Context(), AuthenticatedUserId, id)
	fmt.Fprintln(w, "Successfully sign up")
}

func (app *Application) Login(w http.ResponseWriter, r *http.Request) {
	userForm, err := app.GetUserFrom(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error parsing the body"), http.StatusBadRequest)
		return
	}

	id, err := app.UserModel.Get(r.Context(), User{Username: userForm.Username, Email: userForm.Email, Password: userForm.Password})

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error getting the user"), http.StatusInternalServerError)
		return
	}

	err = app.SessionManager.RenewToken(r.Context())

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Error renewing the token up"), http.StatusInternalServerError)
		return
	}

	app.SessionManager.Put(r.Context(), AuthenticatedUserId, id)

	fmt.Fprintln(w, "Successfully login")
}

func (app *Application) Logout(w http.ResponseWriter, r *http.Request) {
	err := app.SessionManager.RenewToken(r.Context())

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error renewing the toke", http.StatusInternalServerError)
		return
	}
	app.SessionManager.PopInt(r.Context(), AuthenticatedUserId)

	fmt.Fprintln(w, "Successfully logout")
}

func (app *Application) GetUser(w http.ResponseWriter, r *http.Request) {
	id, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	user, err := app.UserModel.GetId(r.Context(), id)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retrieving the User", http.StatusBadRequest)
		return
	}

	pretty, err := json.MarshalIndent(user, " ", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error encoding the user to JSON", http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, string(pretty))
}

func (app *Application) ModifyUser(w http.ResponseWriter, r *http.Request) {
	id, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	newUserOptions, err := app.GetUserModifyForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	err = app.UserModel.Modify(r.Context(), newUserOptions.Username, newUserOptions.Email, id)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error modifying the user", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, "/user", http.StatusSeeOther)
}

func (app *Application) CreateCourse(w http.ResponseWriter, r *http.Request) {

	course, err := app.GetCourseFormLink(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from Onedrive API", http.StatusBadRequest)
		return
	}

	userId, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	id, err := app.CourseModel.Insert(r.Context(), course, userId)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error inserting the course", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/courses/%d", id), http.StatusSeeOther)
}

func (app *Application) ViewCourses(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	courses, err := app.CourseModel.List(r.Context(), userId)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting courses", http.StatusBadRequest)
		return
	}

	coursesJson, err := json.MarshalIndent(courses, "", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting courses", http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, string(coursesJson))
}

func (app *Application) ViewCourse(w http.ResponseWriter, r *http.Request) {

	id, err := strconv.Atoi(r.PathValue("id"))

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error converting the id", http.StatusBadRequest)
		return
	}

	if id < -1 {
		http.Error(w, "Error the id must be greater or equal to 1", http.StatusBadRequest)
		return
	}

	userId, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	course, err := app.CourseModel.Get(r.Context(), id, userId)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retring the course from the db", http.StatusBadRequest)
		return
	}

	pretty, err := json.MarshalIndent(course, "", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retring the course from the db", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, string(pretty))
}

func (app *Application) DeleteCourse(w http.ResponseWriter, r *http.Request) {

	id, err := strconv.Atoi(r.PathValue("id"))

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error converting the id", http.StatusBadRequest)
		return
	}

	if id < -1 {
		http.Error(w, "Error the id must be greater or equal to 1", http.StatusBadRequest)
		return
	}

	userId, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	err = app.CourseModel.Delete(r.Context(), id, userId)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error deleting the course from the db", http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, "The course was deleted successfully!")
}

func (app *Application) UpdateCourse(w http.ResponseWriter, r *http.Request) {

	id, err := strconv.Atoi(r.PathValue("id"))

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error converting the id", http.StatusBadRequest)
		return
	}

	if id < -1 {
		http.Error(w, "Error the id must be greater or equal to 1", http.StatusBadRequest)
		return
	}

	course, err := app.GetCourseFormLink(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	userId, ok := r.Context().Value(CurrentUserIdKey).(int)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	id, err = app.CourseModel.Update(r.Context(), course, id, userId)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error updating the course from the db", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/courses/%d", id), http.StatusSeeOther)
}
