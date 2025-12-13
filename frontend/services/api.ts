import { Course, ApiCourseResponse, ApiCourseInner, ApiCoursePart, ApiCourseResources, Lesson, Module } from '../types.ts';

// Configuration
const API_BASE_URL = 'http://localhost:8080';

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP Error: ${response.status}`);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}

const formatDuration = (rawDuration?: number): string => {
  if (!rawDuration || rawDuration <= 0) {
    return '00:00';
  }
  const totalSeconds = Math.max(1, Math.round(rawDuration / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const parseDurationStringToSeconds = (duration?: string): number => {
  if (!duration) return 0;
  const [minStr = '0', secStr = '0'] = duration.split(':');
  const minutes = Number(minStr) || 0;
  const seconds = Number(secStr) || 0;
  return minutes * 60 + seconds;
};

const getSubParts = (part: ApiCoursePart): ApiCoursePart[] => {
  const nested = part.subParts ?? (part as { ['sub-parts']?: ApiCoursePart[] })['sub-parts'];
  return Array.isArray(nested) ? nested : [];
};

const collectLessonsFromPart = (part: ApiCoursePart, partId: string): Lesson[] => {
  const lessons: Lesson[] = [];

  const files = part.files ?? [];
  files.forEach((file, idx) => {
    lessons.push({
      id: `${partId}-file-${idx}`,
      title: file.name || `File ${idx + 1}`,
      duration: formatDuration(file.duration),
      isCompleted: false,
      type: 'video',
      videoUrl: file.url,
    });
  });

  const subParts = getSubParts(part);
  subParts.forEach((subPart, idx) => {
    const nestedLessons = collectLessonsFromPart(subPart, `${partId}-sub-${idx}`);
    if (nestedLessons.length) {
      lessons.push(...nestedLessons);
    } else {
      lessons.push({
        id: `${partId}-sub-${idx}`,
        title: subPart.name || `Part ${idx + 1}`,
        duration: formatDuration(subPart.duration),
        isCompleted: false,
        type: 'video',
      });
    }
  });

  if (!lessons.length) {
    lessons.push({
      id: `${partId}-lesson`,
      title: part.name || 'Lesson',
      duration: formatDuration(part.duration),
      isCompleted: false,
      type: 'video',
    });
  }

  return lessons;
};

const mapApiPartToModule = (part: ApiCoursePart, index: number): Module => ({
  id: `mod-${index}`,
  title: part.name || `Part ${index + 1}`,
  lessons: collectLessonsFromPart(part, `part-${index}`),
});

const buildModules = (resources: ApiCourseResources): Module[] => {
  const parts = Array.isArray(resources.parts) ? resources.parts : [];
  const effectiveParts = parts.length
    ? parts
    : [
        {
          name: resources.name || 'Course Content',
          duration: resources.duration,
          files: resources.files ?? [],
          subParts: [],
        },
      ];

  const modules = effectiveParts.map(mapApiPartToModule).filter((module) => module.lessons.length);

  if (modules.length) return modules;

  return [
    {
      id: 'mod-1',
      title: resources.name || 'Course Content',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Content unavailable',
          duration: '00:00',
          isCompleted: false,
          type: 'video',
        },
      ],
    },
  ];
};

// TRANSFORMERS: Map Backend Data <-> UI Data
const mapApiToUi = (apiCourse: ApiCourseResponse): Course => {
  const resources = apiCourse.courseResources || { name: 'Untitled Course', duration: 0, parts: [], files: [] };

  return {
    id: apiCourse.id?.toString() ?? 'unknown',
    title: resources.name || 'Untitled Course',
    duration: resources.duration ? `${Math.round(resources.duration / 60)} min` : undefined,
    modules: buildModules(resources),
  };
};

const mapUiToApi = (course: Omit<Course, 'id'>): ApiCourseInner => {
  const totalDuration = course.modules?.reduce((total, module) => {
    const moduleDuration = module.lessons.reduce((lessonTotal, lesson) => lessonTotal + parseDurationStringToSeconds(lesson.duration), 0);
    return total + moduleDuration;
  }, 0);

  return {
    name: course.title,
    duration: totalDuration,
    parts: (course.modules || []).map((module) => ({
      name: module.title,
      duration: module.lessons.reduce((lessonTotal, lesson) => lessonTotal + parseDurationStringToSeconds(lesson.duration), 0),
      files: module.lessons.map((lesson, idx) => ({
        name: lesson.title || `Lesson ${idx + 1}`,
        url: lesson.videoUrl || '',
        format: 'video/mp4',
        duration: parseDurationStringToSeconds(lesson.duration),
      })),
    })),
    files: [],
  };
};

export const CourseService = {
  getAll: async (): Promise<Course[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`);
      const apiData = await handleResponse<ApiCourseResponse[]>(res);
      // Ensure we get an array before mapping
      return Array.isArray(apiData) ? apiData.map(mapApiToUi) : [];
    } catch (error) {
      console.error("Failed to fetch courses. Ensure Go backend is running on port 8080 and CORS is enabled.", error);
      return [];
    }
  },

  getById: async (id: string): Promise<Course> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`);
    const apiData = await handleResponse<ApiCourseResponse>(res);
    return mapApiToUi(apiData);
  },

  create: async (course: Omit<Course, 'id'>): Promise<Course> => {
    const payload = mapUiToApi(course);

    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiData = await handleResponse<ApiCourseResponse>(res);
    return mapApiToUi(apiData);
  },

  update: async (id: string, course: Partial<Course>): Promise<Course> => {
    const payload = mapUiToApi({
      title: course.title || 'Course',
      modules: course.modules || [],
    });

    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const apiData = await handleResponse<ApiCourseResponse>(res);
    return mapApiToUi(apiData);
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete course');
  },
};