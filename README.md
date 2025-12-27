# 📚 CourseTracker

A comprehensive full-stack application for tracking and managing your OneDrive-hosted video courses, built with Go and Next.js.

## 🎯 Overview

CourseTracker seamlessly integrates with Microsoft OneDrive to automatically fetch and organize your video courses, allowing you to track your learning progress with precision. The application provides a robust REST API backend written in Go and a modern Next.js frontend interface.

## ✨ Current Features

### Backend (Go)
- **🔐 Secure Authentication System**
  - User registration and login with bcrypt password hashing
  - Session-based authentication with PostgreSQL session store
  - Secure cookie management with HTTP-only and SameSite policies
  - Protected routes with middleware authentication

- **📁 OneDrive Integration**
  - Automatic course fetching from OneDrive shared links
  - Hierarchical course structure parsing (parts, sub-parts, files)
  - Video duration extraction and aggregation
  - Support for multiple file formats

- **📊 Progress Tracking**
  - Track watched time for each video resource
  - Mark videos as completed
  - View overall course progress with aggregated statistics
  - Per-resource and per-course progress views

- **🎓 Course Management**
  - Create courses from OneDrive URLs
  - View all courses with metadata (name, duration, timestamps)
  - Update course information and sync with OneDrive
  - Delete courses with cascade deletion of progress data
  - JSONB storage for flexible course structure

- **👤 User Management**
  - User profile retrieval
  - Profile modification (username, email)
  - User existence checks for validation

### Frontend (Next.js)
- Modern, responsive UI with Next.js 14+
- User authentication pages (login/signup)
- Dashboard for course overview
- Individual course detail pages
- Beautiful UI components with animations

### Infrastructure
- **Database**: PostgreSQL with pgx driver
- **Session Management**: Server-side sessions with 12-hour lifetime
- **CORS**: Configured for cross-origin requests
- **Middleware**: Request logging, security headers, authentication
- **Migrations**: SQL migrations with Goose

## 🚀 Roadmap - Upcoming Features

The following features are planned for future releases:

### 🎯 User Profile Page
- Dedicated user profile dashboard
- Display user statistics and achievements
- Customizable profile settings

### 🤝 Course Sharing
- Share your courses with other users
- Grant access to specific courses
- View courses shared by others
- Collaborative learning features

### 📅 GitHub-Style Streak Calendar
- Visual calendar showing daily login streaks
- Track learning consistency over time
- Gamification elements to encourage daily engagement
- Activity heatmap visualization

### 🔒 Sharing Access Management
- Revoke shared course access
- Manage permissions for shared courses
- View list of users with access to your courses
- Notification system for sharing events

## 🛠️ Technology Stack

### Backend
- **Language**: Go 1.25.4
- **Web Framework**: Standard library `net/http` with `alice` middleware chaining
- **Database**: PostgreSQL with `pgx/v5` driver and connection pooling
- **Session Management**: `scs/v2` with PostgreSQL store
- **Authentication**: `bcrypt` for password hashing
- **OneDrive Integration**: Microsoft Graph SDK for Go
- **Azure Authentication**: `azidentity` with device code flow
- **CORS**: `rs/cors` middleware
- **Environment**: `godotenv` for configuration

### Frontend
- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with animations

### Database
- **Primary Database**: PostgreSQL
- **Migration Tool**: Goose
- **Schema**: Users, Courses (JSONB), Progress tracking, Sessions

## 📋 Prerequisites

Before running the application, ensure you have:

- Go 1.25.4 or higher
- PostgreSQL 14 or higher
- Node.js 18+ and npm (for frontend)
- Microsoft Azure account with OneDrive API access
- Azure App Registration with appropriate permissions

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Piccio-Code/Course_Tracker.git
cd Course_Tracker
```

### 2. Backend Setup

#### Install Go Dependencies

```bash
go mod download
```

#### Configure Environment Variables

Create `app/.env` file with the following variables:

```env
# Database
DATABASE_URL=postgres://username:password@localhost:5432/coursetracker?sslmode=disable

# Azure/OneDrive API
TENANT_ID=your-azure-tenant-id
CLIENT_ID=your-azure-app-client-id

# Server Configuration (optional)
PORT=8080
```

#### Run Database Migrations

```bash
# Install Goose (if not already installed)
go install github.com/pressly/goose/v3/cmd/goose@latest

# Run migrations
cd app/migrations
goose postgres "your-database-url" up
```

#### Start the Backend Server

```bash
# From the project root
cd app/backend

# Development mode (allows HTTP cookies)
go run . -dev

# With OneDrive integration
go run . -onedrive -dev

# Production mode (requires HTTPS)
go run . -onedrive
```

**Command Line Flags:**
- `-dev`: Disables secure cookie requirement (use only for development)
- `-onedrive`: Enables OneDrive API connection with device code authentication

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The frontend will be available at `http://localhost:3000`

## 📡 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Logout (Protected)
```http
POST /auth/logout
```

### User Endpoints (Protected)

#### Get Current User
```http
GET /user
```

#### Modify User
```http
PUT /user
Content-Type: application/json

{
  "username": "string",
  "email": "string"
}
```

### Course Endpoints (Protected)

#### Create Course
```http
POST /courses
Content-Type: application/json

{
  "url": "onedrive-share-url",
  "name": "Course Name (optional)"
}
```

#### Get All Courses
```http
GET /courses
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Course Name",
    "duration": 3600000,
    "created": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Single Course
```http
GET /courses/{id}
```

**Response:**
```json
{
  "id": 1,
  "courseResources": {
    "name": "Course Name",
    "duration": 3600000,
    "url": "onedrive-url",
    "parts": [...],
    "files": [...]
  },
  "created": "2024-01-01T00:00:00Z",
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

#### Update Course
```http
PUT /courses/{id}
Content-Type: application/json

{
  "url": "new-onedrive-url",
  "name": "Updated Name"
}
```

#### Delete Course
```http
DELETE /courses/{id}
```

### Progress Endpoints (Protected)

#### Get All Progress
```http
GET /progress
```

**Response:**
```json
[
  {
    "course_name": "Course Name",
    "course_id": 1,
    "course_total_time": 3600000,
    "time_watched": 1800000
  }
]
```

#### Get Course Progress
```http
GET /progress/{courseId}
```

**Response:**
```json
[
  {
    "id": 1,
    "time_watched": 120000,
    "completed": false,
    "url": "video-url"
  }
]
```

#### Insert Progress
```http
POST /progress/{courseId}
Content-Type: application/json

{
  "watchedTimeMills": 120000,
  "completed": false,
  "url": "video-resource-url"
}
```

#### Update Progress
```http
PUT /progress/{courseId}
Content-Type: application/json

{
  "watchedTimeMills": 240000,
  "completed": true,
  "url": "video-resource-url"
}
```

#### Delete Progress
```http
DELETE /progress/{courseId}
Content-Type: application/json

{
  "url": "video-resource-url"
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password BYTEA NOT NULL,
    UNIQUE(username),
    UNIQUE(email)
);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### Courses Table
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_resources JSONB NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Users Progress Table
```sql
CREATE TABLE users_progress (
    id SERIAL PRIMARY KEY,
    time_watched INT NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    resource_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Sessions Table
Managed automatically by `scs/pgxstore`

## 🏗️ Project Structure

```
CourseTracker/
├── app/
│   ├── backend/
│   │   ├── main.go           # Application entry point
│   │   ├── routes.go         # Route definitions
│   │   ├── handles.go        # HTTP handlers
│   │   ├── middlewares.go    # Middleware functions
│   │   └── helpers.go        # Helper functions
│   ├── models/
│   │   ├── courseModels.go   # Course data access
│   │   ├── userModels.go     # User data access
│   │   └── userProgressModel.go
│   ├── customErrors/
│   │   └── authErrors.go     # Custom error types
│   └── migrations/           # Database migrations
├── Wrapper/
│   └── onedrive.go          # OneDrive API wrapper
├── frontend/
│   └── src/
│       ├── app/             # Next.js pages
│       ├── components/      # React components
│       └── lib/            # Utilities and API client
├── go.mod
├── go.sum
└── README.md
```

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with cost factor 12
- **Session Security**: HTTP-only cookies, SameSite protection
- **HTTPS Enforcement**: Secure cookies in production mode
- **SQL Injection Prevention**: Parameterized queries with pgx
- **CORS Protection**: Whitelist-based origin control
- **Authentication Middleware**: Protected routes require valid session
- **Token Renewal**: Session token renewal on authentication events

## 🚦 Development

### Running Tests
```bash
go test ./...
```

### Code Structure Guidelines
- **Models**: Handle all database operations with transaction support
- **Handlers**: Process HTTP requests and delegate to models
- **Middleware**: Chain using alice for clean composition
- **Context**: Use context for passing user ID through request pipeline

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `TENANT_ID` | Azure tenant ID | Yes (if using OneDrive) |
| `CLIENT_ID` | Azure app client ID | Yes (if using OneDrive) |

## 🐛 Troubleshooting

### Common Issues

**OneDrive Authentication Fails**
- Ensure your Azure app has the required Graph API permissions
- Verify TENANT_ID and CLIENT_ID are correct
- Check that you're using device code flow authentication

**Database Connection Errors**
- Verify PostgreSQL is running
- Check DATABASE_URL format and credentials
- Ensure migrations have been run

**CORS Errors**
- Add your frontend URL to the `AllowedOrigins` in `main.go`
- Check that credentials are being sent with requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**

This is a personal project created for learning and portfolio purposes. Use at your own risk.

## 👨‍💻 Author

**Piccio-Code**

This code is the intellectual property of the author. All rights reserved.

---

## 🌟 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue if you find bugs or have feature requests.

## 📧 Contact

For questions or inquiries, please open an issue on GitHub.

---

**⭐ If you find this project useful, consider giving it a star!**

