import { API_CourseResponse, API_CoursesListResponse } from "./types.ts";

// Mock Data matching your Go Structs
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
    parts: [
      {
        name: "Introduction",
        duration: 3600,
        files: [
          { name: "Welcome!", url: "", format: "mp4", duration: 296 },
          { name: "Setting up environment", url: "", format: "mp4", duration: 927 },
          { name: "Go 101: Variables", url: "", format: "mp4", duration: 1473 }
        ],
        "sub-parts": [] 
      },
      {
        name: "Counting Words",
        duration: 4000,
        files: [
          { name: "Reading Input", url: "", format: "mp4", duration: 605 },
          { name: "String Manipulation", url: "", format: "mp4", duration: 510 }
        ],
        "sub-parts": [
            {
                name: "Advanced Word Counting",
                duration: 2000,
                files: [
                    { name: "Regex in Go", url: "", format: "mp4", duration: 720 },
                    { name: "Performance Tuning", url: "", format: "mp4", duration: 840 }
                ]
            }
        ]
      }
    ]
  }
};

export const MOCK_API_LIST_RESPONSE: API_CoursesListResponse[] = [
    {
        id: 101,
        name: "Command Line Applications in Go",
        created: "2024-01-15T10:00:00Z",
        lastUpdated: "2024-01-20T10:00:00Z"
    },
    {
        id: 102,
        name: "Mastering Go Concurrency",
        created: "2024-02-01T10:00:00Z",
        lastUpdated: "2024-02-05T10:00:00Z"
    },
    {
        id: 103,
        name: "Microservices with Go & gRPC",
        created: "2024-03-10T10:00:00Z",
        lastUpdated: "2024-03-12T10:00:00Z"
    }
];