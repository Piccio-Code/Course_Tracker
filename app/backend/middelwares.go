package main

import (
	"context"
	"github.com/lestrrat-go/jwx/v3/jwk"
	"github.com/lestrrat-go/jwx/v3/jwt"
	"net/http"
	"time"
)

type logResponder struct {
	http.ResponseWriter
	code int
	set  bool
}

type User struct {
	ID       string
	Email    string
	Username string
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

		app.InfoLog.Printf("%s %v %d %s %v", r.Method, r.Host, logWriter.code, r.URL.Path, time.Since(start))
	})
}

func (app *Application) RequireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		keyset, err := jwk.Fetch(r.Context(), app.BaseUrl+"/api/auth/jwks")

		if err != nil {
			app.ErrorLog.Printf("[Auth] error fetching JWKS keys (this might be expected): %s", err)
			http.Error(w, "Authentication endpoint not configured properly", http.StatusUnauthorized)
			return
		}

		token, err := jwt.ParseRequest(r, jwt.WithKeySet(keyset))

		if err != nil {
			app.ErrorLog.Printf("[Auth] error parsing the token: %s", err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		app.InfoLog.Printf("[Auth] Token parsed successfully")

		id, exist := token.Subject()

		if !exist {
			app.ErrorLog.Printf("User Not Found: %s \n", err)
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		var username string

		err = token.Get("name", &username)
		if err != nil {
			app.ErrorLog.Printf("Username field not found in the token: %s \n", err)
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		var email string

		err = token.Get("email", &email)
		if err != nil {
			app.ErrorLog.Printf("Email field not found in the token: %s \n", err)
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), CurrentUser, User{id, username, email})
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
