export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  type: 'video' | 'text' | 'quiz';
  videoUrl?: string; // Placeholder for actual video URL
  transcript?: string; // For AI context
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  modules: Module[];
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  lastPlayedLessonId: string;
}

// --- API response shapes ---
export interface ApiCourseFile {
  name: string;
  url: string;
  format: string;
  duration: number;
}

export interface ApiCoursePart {
  name: string;
  duration: number;
  files?: ApiCourseFile[];
  subParts?: ApiCoursePart[];
  ['sub-parts']?: ApiCoursePart[];
}

export interface ApiCourseResources {
  name: string;
  duration: number;
  parts?: ApiCoursePart[];
  files?: ApiCourseFile[];
}

export interface ApiCourseResponse {
  id: number;
  courseResources: ApiCourseResources;
  created: string;
  lastUpdated: string;
}

export interface ApiCourseInner extends ApiCourseResources {}