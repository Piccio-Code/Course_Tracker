package main

import (
	"context"
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

func (app *Application) RequireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		id := app.SessionManager.GetInt(r.Context(), AuthenticatedUserId)
		exist, err := app.UserModel.Exist(r.Context(), id)

		if err != nil {
			app.ErrorLog.Println(err)
			http.Error(w, "Error checking user existence", http.StatusInternalServerError)
			return
		}

		if !exist {
			http.Error(w, "Error user is Unauthorized", http.StatusUnauthorized)
			return
		}

		w.Header().Add("Cache-Control", "no-store")

		ctx := context.WithValue(r.Context(), CurrentUserIdKey, id)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func (app *Application) SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-XSS-Protection", "0")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Cache-Control", "no-store, max-age=0")
		w.Header().Set(
			"Permissions-Policy",
			"geolocation=(), microphone=(), camera=(), fullscreen=(self), payment=()",
		)
		w.Header().Set(
			"Content-Security-Policy",
			"default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com; object-src 'none'; frame-ancestors 'none'; connect-src 'self'",
		)

		next.ServeHTTP(w, r)
	})
}
