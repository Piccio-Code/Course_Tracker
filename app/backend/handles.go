package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func (app *Application) CreateCourse(w http.ResponseWriter, r *http.Request) {

	course, err := app.GetCourseFormLink(r)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting the course from Onedrive API", http.StatusBadRequest)
		return
	}

	id, err := app.courseModel.Insert(r.Context(), course)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error inserting the course", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "ID of inserted course: %d", id)
}

func (app *Application) ViewCourses(w http.ResponseWriter, r *http.Request) {
	courses, err := app.courseModel.List(r.Context())

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error getting courses", http.StatusBadRequest)
		return
	}

	fmt.Fprintln(w, courses)
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

	course, err := app.courseModel.Get(r.Context(), id)

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

	err = app.courseModel.Delete(r.Context(), id)

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

	id, err = app.courseModel.Update(r.Context(), course, id)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Error updating the course from the db", http.StatusBadRequest)
		return
	}

	http.Redirect(w, r, fmt.Sprintf("/courses/%d", id), http.StatusSeeOther)
}
