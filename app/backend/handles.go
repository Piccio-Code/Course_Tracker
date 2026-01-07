package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func (app *Application) CreateCourse(w http.ResponseWriter, r *http.Request) {

	courseForm, err := app.GetCourseForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from Onedrive API", http.StatusBadRequest)
		return
	}

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	course, err := app.Onedrive.NewCourse(courseForm.URL, courseForm.Name)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from onedrive", http.StatusBadRequest)
		return
	}

	id, err := app.CourseModel.Insert(r.Context(), course, user.ID)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error inserting the course", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/courses/%d", id), http.StatusSeeOther)
}

func (app *Application) ViewCourses(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	courses, err := app.CourseModel.List(r.Context(), user.ID)

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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	course, err := app.CourseModel.Get(r.Context(), id, user.ID)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retrieving the course from the db", http.StatusBadRequest)
		return
	}

	pretty, err := json.MarshalIndent(course, "", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retrieving the course from the db", http.StatusBadRequest)
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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	err = app.CourseModel.Delete(r.Context(), id, user.ID)

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

	courseForm, err := app.GetCourseForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	if courseForm.URL == "" {
		course, err := app.CourseModel.Get(r.Context(), id, user.ID)

		if err != nil {
			app.ErrorLog.Println(err)
			http.Error(w, "Course do not exist", http.StatusBadRequest)
			return
		}

		courseForm.URL = course.CourseResources.URL

		if courseForm.Name == "" {
			courseForm.Name = course.CourseResources.Name
		}
	}

	course, err := app.Onedrive.NewCourse(courseForm.URL, courseForm.Name)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from onedrive", http.StatusBadRequest)
		return
	}

	id, err = app.CourseModel.Update(r.Context(), course, id, user.ID)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error updating the course from the db", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/courses/%d", id), http.StatusSeeOther)
}

func (app *Application) GetCourseProgress(w http.ResponseWriter, r *http.Request) {
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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	progress, err := app.ProgressModel.GetCourseProgress(r.Context(), id, user.ID)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course progress", http.StatusBadRequest)
		return
	}

	pretty, err := json.MarshalIndent(progress, "", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error retrieving the course from the db", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, string(pretty))
}

func (app *Application) InsertCourseProgress(w http.ResponseWriter, r *http.Request) {
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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	progressForm, err := app.GetProgressForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	err = app.ProgressModel.Insert(r.Context(), id, user.ID, progressForm.WatchedTimeMills, progressForm.Completed, progressForm.URL)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error Inserting the course progress", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "Created successfully!")
}

func (app *Application) UpdateCourseProgress(w http.ResponseWriter, r *http.Request) {
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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	progressForm, err := app.GetProgressForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	err = app.ProgressModel.Update(r.Context(), id, user.ID, progressForm.WatchedTimeMills, progressForm.Completed, progressForm.URL)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error Inserting the course progress", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *Application) DeleteCourseProgress(w http.ResponseWriter, r *http.Request) {
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

	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	progressForm, err := app.GetProgressForm(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error parsing the body", http.StatusBadRequest)
		return
	}

	err = app.ProgressModel.Delete(r.Context(), id, user.ID, progressForm.URL)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error Inserting the course progress", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (app *Application) GetProgress(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(CurrentUser).(User)

	if !ok {
		http.Error(w, "Error parsing the User id", http.StatusBadRequest)
		return
	}

	progress, err := app.ProgressModel.GetProgresses(r.Context(), user.ID)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course progress", http.StatusBadRequest)
		return
	}

	pretty, err := json.MarshalIndent(progress, " ", "\t")

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error encoding the user to JSON", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, string(pretty))
}
