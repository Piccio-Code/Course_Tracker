// --- API Types (matching Go structs) ---
export interface API_CourseFile {
  name: string;
  url: string;
  format: string;
  duration: number; // seconds or milliseconds
}

export interface API_CoursePart {
  name: string;
  duration: number;
  "sub-parts"?: API_CoursePart[];
  files: API_CourseFile[];
}

export interface API_Course {
  name: string;
  duration: number;
  parts: API_CoursePart[];
  files: API_CourseFile[];
}

export interface API_CourseResponse {
  id: number;
  courseResources: API_Course;
  created: string;
  lastUpdated: string;
}

export interface API_CoursesListResponse {
  id: number;
  name: string;
  created: string;
  lastUpdated: string;
}

// --- UI Types ---
export interface Lesson {
  id: string;
  title: string;
  duration: string; // formatted MM:SS
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
  id: string;
  title: string;
  description: string;
  thumbnailGradient: string;
  progress: number;
  totalLessons: number;
  modules: Module[];
}

export interface UserProgress {
  completedLessonIds: string[];
  lastPlayedLessonId: string;
}

