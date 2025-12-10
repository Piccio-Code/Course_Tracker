package main

import (
	"fmt"
	"github.com/ajg/form"
	"net/http"
)

type CoursesFolder struct {
	OnedriveURL string `form:"url"`
}

func (app *Application) GetCoursesInFolder(w http.ResponseWriter, r *http.Request) {
	decoder := form.NewDecoder(r.Body)

	var coursesFolder CoursesFolder

	if err := decoder.Decode(&coursesFolder); err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, "Form could not be decoded", http.StatusBadRequest)
		return
	}

	app.InfoLog.Println(coursesFolder)

	folders, err := app.Onedrive.GetFolders(coursesFolder.OnedriveURL)

	if err != nil {
		app.ErrorLog.Println(err)
		http.Error(w, fmt.Sprintf("Invalid URL %s", coursesFolder.OnedriveURL), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "The folders are : %v", folders)
}

func (app *Application) AddCourseFolder(w http.ResponseWriter, r *http.Request) {
	decoder := form.NewDecoder(r.Body)

	var coursesFolder CoursesFolder

	if err := decoder.Decode(&coursesFolder); err != nil {
		http.Error(w, "Form could not be decoded", http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "Decoded: %#v", coursesFolder)
}
