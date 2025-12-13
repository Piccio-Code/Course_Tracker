package main

import (
	"net/http"
	"time"
)

func (app *Application) Logger(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		start := time.Now()

		next.ServeHTTP(w, r)

		app.InfoLog.Printf("%s %s %s %v", r.RemoteAddr, r.Method, r.URL.Path, time.Since(start))
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
