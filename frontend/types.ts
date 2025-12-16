// --- API Types (Matching Go Structs) ---

export interface API_CourseFile {
  name: string;
  url: string;
  format: string;
  duration: number; // Milliseconds based on new API doc
}

export interface API_CoursePart {
  name: string;
  duration: number; // Milliseconds
  "sub-parts"?: API_CoursePart[];
  files: API_CourseFile[];
}

export interface API_Course {
  name: string;
  duration: number; // Milliseconds
  parts: API_CoursePart[];
  files: API_CourseFile[];
}

export interface API_CourseResponse {
  id: number;
  courseResources: API_Course;
  created: string; // ISO Date string
  lastUpdated: string; // ISO Date string
}

export interface API_CoursesListResponse {
  id: number;
  name: string;
  created: string;
  lastUpdated: string;
}

// --- UI Types (Consumed by React Components) ---

export interface UserProfile {
    username: string;
    email: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // Formatted MM:SS
  isCompleted: boolean;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string;
  transcript?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string; // Converted to string for consistency
  title: string;
  description: string; // Generated/Placeholder as API doesn't provide yet
  thumbnailGradient: string; // UI only
  progress: number; // UI only
  totalLessons: number;
  modules: Module[];
}

export interface UserProgress {
  completedLessonIds: string[];
  lastPlayedLessonId: string;
}