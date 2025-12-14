package main

import (
	"net/http"
	"time"
)

type logResponder struct {
	http.ResponseWriter
	code int
	set  bool
}

func (rw *logResponder) WriteHeader(code int) {
	rw.code = code
	rw.set = true
	rw.ResponseWriter.WriteHeader(code)
}

func (app *Application) Logger(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		start := time.Now()

		logWriter := &logResponder{w, 200, false}

		next.ServeHTTP(logWriter, r)

		app.InfoLog.Printf("%s %d %s %v", r.Method, logWriter.code, r.URL.Path, time.Since(start))
	})
}

// enableCORS adds permissive CORS headers for local frontend development.
// Keep scope limited to what we need for the React app.
func (app *Application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")

		// Short-circuit preflight requests.
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
