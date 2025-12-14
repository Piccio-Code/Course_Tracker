import { API_CourseResponse, API_CoursesListResponse, Course, Module, Lesson, API_CoursePart, API_CourseFile } from '../types.ts';

// Helper to format duration (handles ms or seconds) into MM:SS.
// If duration is zero/negative, return empty string so UI hides it.
const formatDuration = (rawDuration: number): string => {
  if (!rawDuration || rawDuration <= 0) return "";
  const seconds = rawDuration >= 1000 ? Math.round(rawDuration / 1000) : rawDuration;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Map a single File to a UI Lesson
const mapFileToLesson = (file: API_CourseFile, index: number, prefix: string): Lesson => ({
  id: `${prefix}-file-${index}`,
  title: file.name,
  duration: formatDuration(file.duration),
  isCompleted: false, // Default state
  type: 'video',
  videoUrl: file.url,
  transcript: `Transcript for ${file.name}` // Placeholder for AI context
});

// Recursively flatten Parts and SubParts into a list of UI Modules
const flattenPartsToModules = (parts: API_CoursePart[], parentIdPrefix: string = 'mod'): Module[] => {
  let modules: Module[] = [];

  parts.forEach((part, index) => {
    const partId = `${parentIdPrefix}-${index}`;
    
    // Create a module for the current part if it has files
    if (part.files && part.files.length > 0) {
      modules.push({
        id: partId,
        title: part.name,
        lessons: part.files.map((f, i) => mapFileToLesson(f, i, partId))
      });
    }

    // Process sub-parts (Flattening them to modules for now)
    if (part["sub-parts"] && part["sub-parts"].length > 0) {
       const subModules = flattenPartsToModules(part["sub-parts"], `${partId}-sub`);
       modules = [...modules, ...subModules];
    }
  });

  return modules;
};

// Map Full Course Details Response
export const mapCourseResponseToCourse = (response: API_CourseResponse): Course => {
  const { id, courseResources } = response;
  
  // 1. Map Parts to Modules
  let modules = flattenPartsToModules(courseResources.parts || []);

  // 2. If there are root level files, create a "General" module
  if (courseResources.files && courseResources.files.length > 0) {
    const rootModule: Module = {
      id: `root-files-${id}`,
      title: "General Resources",
      lessons: courseResources.files.map((f, i) => mapFileToLesson(f, i, `root-${id}`))
    };
    modules = [rootModule, ...modules];
  }

  // Calculate total lessons
  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return {
    id: id.toString(),
    title: courseResources.name,
    description: "Course loaded from external API. Master the concepts efficiently.", // Placeholder
    thumbnailGradient: "from-purple-600 to-blue-600", // Default UI style
    progress: 0,
    totalLessons,
    modules
  };
};

// Map List Response to Course Summaries (for Dashboard)
export const mapListResponseToCourseSummary = (response: API_CoursesListResponse): Course => {
  return {
    id: response.id.toString(),
    title: response.name,
    description: `Created on ${new Date(response.created).toLocaleDateString()}`,
    thumbnailGradient: "from-slate-700 to-slate-900", // Default
    progress: 0,
    totalLessons: 0, // Not available in list view
    modules: [] // Not available in list view
  };
};