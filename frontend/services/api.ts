import { API_CourseResponse, API_CoursesListResponse, UserProfile } from '../types.ts';

const API_BASE_URL = 'http://192.168.1.3:8080'; // Relative path since usually hosted on same origin or proxied

// Helper to handle x-www-form-urlencoded bodies
const toFormData = (data: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      params.append(key, String(data[key]));
    }
  }
  return params;
};

// Generic fetch wrapper
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const config = {
    ...options,
    credentials: 'include' as RequestCredentials, // Critical for cookie-based sessions
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // Handle 4xx/5xx errors
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  // Handle responses that might not be JSON (like simple text success messages)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  // Return text for non-JSON responses (like login/signup success messages)
  return response.text() as unknown as T;
};

export const api = {
  // --- Auth ---
  signup: (data: { username: string; email: string; password: string }) => {
    return apiFetch<string>('/auth/signup', {
      method: 'POST',
      // Browser sets Content-Type to application/x-www-form-urlencoded automatically for URLSearchParams
      body: toFormData(data),
    });
  },

  login: (data: { username?: string; email: string; password: string }) => {
    return apiFetch<string>('/auth/login', {
      method: 'POST',
      body: toFormData({ ...data, username: data.username || '' }),
    });
  },

  logout: () => {
    return apiFetch<string>('/auth/logout', {
      method: 'POST',
    });
  },

  // --- User ---
  getUser: () => {
    return apiFetch<UserProfile>('/user', { method: 'GET' });
  },

  updateUser: (data: { username: string; email: string }) => {
    // Returns the user object because of the 303 redirect to GET /user
    return apiFetch<UserProfile>('/user', {
      method: 'PUT',
      body: toFormData(data),
    });
  },

  // --- Courses ---
  getCourses: () => {
    return apiFetch<API_CoursesListResponse[]>('/courses', { method: 'GET' });
  },

  getCourseDetails: (id: string | number) => {
    return apiFetch<API_CourseResponse>(`/courses/${id}`, { method: 'GET' });
  },

  createCourse: (data: { url: string; name?: string }) => {
    // Returns the course details because of the 303 redirect to GET /courses/{id}
    return apiFetch<API_CourseResponse>('/courses', {
      method: 'POST',
      body: toFormData(data),
    });
  },

  deleteCourse: (id: string | number) => {
    return apiFetch<string>(`/courses/${id}`, { method: 'DELETE' });
  }
};
