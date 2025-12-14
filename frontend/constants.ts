import { API_CourseResponse, API_CoursesListResponse } from "./types.ts";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Optional mock data fallback
export const MOCK_API_COURSE_RESPONSE: API_CourseResponse = {
  id: 101,
  created: "2024-01-15T10:00:00Z",
  lastUpdated: "2024-01-20T10:00:00Z",
  courseResources: {
    name: "Command Line Applications in Go",
    duration: 12000,
    files: [
       { name: "Course Intro", url: "", format: "mp4", duration: 180 }
    ],
    parts: []
  }
};

export const MOCK_API_LIST_RESPONSE: API_CoursesListResponse[] = [
  {
    id: 101,
    name: "Command Line Applications in Go",
    created: "2024-01-15T10:00:00Z",
    lastUpdated: "2024-01-20T10:00:00Z"
  }
];

