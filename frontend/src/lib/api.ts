// Configurazione API - Modifica qui l'URL base del backend https://api.coursetracker.it o http://localhost:8080
export const API_BASE_URL = "http://localhost:8080";

// ============================================================================
// INTERFACES - Matching Go structures from Wrapper/onedrive.go
// ============================================================================

/**
 * Rappresenta un singolo file del corso
 * Go struct: CourseFile (Wrapper/onedrive.go)
 */
export interface CourseFile {
  name: string;
  url: string;
  format: string;
  duration: number; // in milliseconds
}

/**
 * Rappresenta una parte/sezione del corso (può contenere sotto-parti)
 * Go struct: CoursePart (Wrapper/onedrive.go)
 */
export interface CoursePart {
  name: string;
  duration: number;
  "sub-parts": CoursePart[] | null;
  files: CourseFile[] | null;
}

/**
 * Struttura completa del corso con tutte le risorse
 * Go struct: Course (Wrapper/onedrive.go)
 */
export interface Course {
  name: string;
  duration: number;
  url: string; // URL della cartella OneDrive/SharePoint del corso
  parts: CoursePart[] | null;
  files: CourseFile[] | null;
}

// ============================================================================
// INTERFACES - Matching Go structures from app/models/courseModels.go
// ============================================================================

/**
 * Risposta per un singolo corso (GET /courses/{id})
 * Go struct: CourseResponse (app/models/courseModels.go)
 */
export interface CourseResponse {
  id: number;
  courseResources: Course;
  created: string; // ISO date string
  lastUpdated: string; // ISO date string
}

/**
 * Risposta per la lista dei corsi (GET /courses)
 * Go struct: CoursesListResponse (app/models/courseModels.go)
 */
export interface CoursesListResponse {
  id: number;
  name: string;
  duration: number;
  created: string; // ISO date string
  lastUpdated: string; // ISO date string
}

// ============================================================================
// INTERFACES - Matching Go structures from app/models/userModels.go
// ============================================================================

/**
 * Rappresenta l'utente
 * Go struct: User (app/models/userModels.go)
 */
export interface User {
  username: string;
  email: string;
}

// ============================================================================
// INTERFACES - Matching Go structures from app/models/userProgressModel.go
// ============================================================================

/**
 * Rappresenta il progresso di una singola risorsa/video
 * Go struct: ResourceProgress (app/models/userProgressModel.go)
 */
export interface ResourceProgress {
  id?: number;
  time_watched?: number; // in milliseconds
  completed?: boolean;
  url?: string;
}

/**
 * Rappresenta il progresso aggregato di un corso
 * Backend response structure
 */
export interface Progress {
  course_name?: string;
  course_id?: number;
  course_total_time?: number;  // millisecondi totali del corso
  time_watched?: number;        // millisecondi guardati dall'utente
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// AUTH API - /auth/*
// ============================================================================

/**
 * Login utente
 * POST /auth/login
 */
export async function login(
  username: string,
  email: string,
  password: string
): Promise<ApiResult<void>> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Errore durante il login" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Errore durante il login",
    };
  }
}

/**
 * Registrazione utente
 * POST /auth/signup
 */
export async function signup(
  username: string,
  email: string,
  password: string
): Promise<ApiResult<void>> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante la registrazione",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Errore durante la registrazione",
    };
  }
}

/**
 * Logout utente
 * POST /auth/logout (protected)
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// USER API - /user
// ============================================================================

/**
 * Recupera i dati dell'utente autenticato
 * GET /user (protected)
 */
export async function getUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch {
    return null;
  }
}

/**
 * Modifica i dati dell'utente
 * PUT /user (protected)
 */
export async function updateUser(
  username: string,
  email: string
): Promise<ApiResult<void>> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("email", email);

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante l'aggiornamento dell'utente",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante l'aggiornamento dell'utente",
    };
  }
}

// ============================================================================
// COURSES API - /courses
// ============================================================================

/**
 * Recupera la lista di tutti i corsi dell'utente
 * GET /courses (protected)
 */
export async function getCourses(): Promise<CoursesListResponse[]> {
  try {
    console.log("[API] GET /courses - Fetching courses...");
    
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log("[API] GET /courses - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] GET /courses - Error:", errorText);
      return [];
    }

    const text = await response.text();
    console.log("[API] GET /courses - Raw response:", text);
    
    // Handle empty response
    if (!text || text.trim() === "" || text.trim() === "null") {
      console.log("[API] GET /courses - Empty or null response, returning []");
      return [];
    }

    const courses: CoursesListResponse[] = JSON.parse(text);
    console.log("[API] GET /courses - Parsed courses:", courses);
    
    return courses || [];
  } catch (err) {
    console.error("[API] GET /courses - Exception:", err);
    return [];
  }
}

/**
 * Recupera un singolo corso con tutte le sue risorse
 * GET /courses/{id} (protected)
 */
export async function getCourse(id: number): Promise<CourseResponse | null> {
  try {
    console.log(`[API] GET /courses/${id} - Fetching course...`);
    
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log(`[API] GET /courses/${id} - Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] GET /courses/${id} - Error:`, errorText);
      return null;
    }

    const text = await response.text();
    console.log(`[API] GET /courses/${id} - Raw response:`, text);
    
    if (!text || text.trim() === "" || text.trim() === "null") {
      console.log(`[API] GET /courses/${id} - Empty or null response`);
      return null;
    }

    const course: CourseResponse = JSON.parse(text);
    console.log(`[API] GET /courses/${id} - Parsed course:`, course);
    
    return course;
  } catch (err) {
    console.error(`[API] GET /courses/${id} - Exception:`, err);
    return null;
  }
}

/**
 * Crea un nuovo corso da un link OneDrive
 * POST /courses (protected)
 */
export async function createCourse(
  link: string,
  name?: string
): Promise<ApiResult<{ id: number }>> {
  try {
    const formData = new URLSearchParams();
    formData.append("link", link);
    if (name) {
      formData.append("name", name);
    }

    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante la creazione del corso",
      };
    }

    // Il backend fa redirect, quindi prendiamo l'ID dall'URL finale
    const url = response.url;
    const idMatch = url.match(/\/courses\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1], 10) : 0;

    return { success: true, data: { id } };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante la creazione del corso",
    };
  }
}

/**
 * Aggiorna un corso esistente
 * PUT /courses/{id} (protected)
 */
export async function updateCourse(
  id: number,
  link: string,
  name?: string
): Promise<ApiResult<{ id: number }>> {
  try {
    const formData = new URLSearchParams();
    formData.append("link", link);
    if (name) {
      formData.append("name", name);
    }

    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante l'aggiornamento del corso",
      };
    }

    return { success: true, data: { id } };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante l'aggiornamento del corso",
    };
  }
}

/**
 * Elimina un corso
 * DELETE /courses/{id} (protected)
 */
export async function deleteCourse(id: number): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante l'eliminazione del corso",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante l'eliminazione del corso",
    };
  }
}

/**
 * Ricarica un corso esistente (aggiorna i contenuti da OneDrive)
 * PUT /courses/{id} (protected)
 * Note: This uses the same endpoint as updateCourse but without changing the link
 */
export async function reloadCourse(id: number): Promise<ApiResult<void>> {
  try {
    // Get the current course data first to retrieve the original link
    const course = await getCourse(id);
    
    if (!course) {
      return {
        success: false,
        error: "Corso non trovato",
      };
    }

    // Call updateCourse with the same course data to trigger a reload
    // The backend will re-fetch the data from OneDrive
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        link: "", // Empty link signals a reload operation
        name: course.courseResources.name,
      }).toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Errore durante il ricaricamento del corso",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante il ricaricamento del corso",
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formatta la durata in millisecondi in formato leggibile (ore e minuti)
 */
export function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / 60000);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Formatta la durata per la visualizzazione nella lista (più compatta)
 */
export function formatDurationCompact(milliseconds: number): string {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Formatta una data ISO in formato italiano
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formatta una data in formato "tempo fa"
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Adesso";
  if (diffMins < 60) return `${diffMins}m fa`;
  if (diffHours < 24) return `${diffHours}h fa`;
  if (diffDays < 7) return `${diffDays}g fa`;
  return formatDate(dateString);
}

/**
 * Conta il numero totale di file in un corso
 */
export function countTotalFiles(course: Course): number {
  let count = course.files?.length || 0;

  function countInParts(parts: CoursePart[] | null): number {
    if (!parts) return 0;
    let partCount = 0;
    for (const part of parts) {
      partCount += part.files?.length || 0;
      partCount += countInParts(part["sub-parts"]);
    }
    return partCount;
  }

  count += countInParts(course.parts);
  return count;
}

/**
 * Conta il numero totale di parti in un corso
 */
export function countTotalParts(course: Course): number {
  function countParts(parts: CoursePart[] | null): number {
    if (!parts) return 0;
    let count = parts.length;
    for (const part of parts) {
      count += countParts(part["sub-parts"]);
    }
    return count;
  }

  return countParts(course.parts);
}

// ============================================================================
// PROGRESS API - /progress
// ============================================================================

/**
 * Recupera il progresso di tutti i corsi dell'utente
 * GET /progress (protected)
 * Returns: Progress[] array with course progress summary
 */
export async function getProgress(): Promise<Progress[]> {
  try {
    console.log("[API] GET /progress - Fetching progress...");
    
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log("[API] GET /progress - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API] GET /progress - Error:", errorText);
      return [];
    }

    const text = await response.text();
    console.log("[API] GET /progress - Raw response:", text);
    
    // Handle empty response
    if (!text || text.trim() === "" || text.trim() === "null") {
      console.log("[API] GET /progress - Empty or null response, returning []");
      return [];
    }

    const progressList: Progress[] = JSON.parse(text);
    console.log("[API] GET /progress - Parsed progress:", progressList);
    
    return progressList || [];
  } catch (err) {
    console.error("[API] GET /progress - Exception:", err);
    return [];
  }
}

/**
 * Recupera il progresso di un singolo corso
 * GET /progress/{id} (protected)
 */
export async function getCourseProgress(courseId: number): Promise<ResourceProgress[]> {
  try {
    console.log(`[API] GET /progress/${courseId} - Fetching course progress...`);
    
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    console.log(`[API] GET /progress/${courseId} - Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] GET /progress/${courseId} - Error:`, errorText);
      return [];
    }

    const text = await response.text();
    console.log(`[API] GET /progress/${courseId} - Raw response:`, text);
    
    // Handle empty response
    if (!text || text.trim() === "" || text.trim() === "null") {
      console.log(`[API] GET /progress/${courseId} - Empty or null response, returning []`);
      return [];
    }

    const progress: ResourceProgress[] = JSON.parse(text);
    console.log(`[API] GET /progress/${courseId} - Parsed progress:`, progress);
    
    return progress || [];
  } catch (err) {
    console.error(`[API] GET /progress/${courseId} - Exception:`, err);
    return [];
  }
}

/**
 * Inserisce un nuovo progresso di una risorsa/video
 * POST /progress/{id} (protected)
 */
export async function insertCourseProgress(
  courseId: number,
  url: string,
  watchedTimeMills: number,
  completed: boolean
): Promise<ApiResult<void>> {
  try {
    console.log(`[API] POST /progress/${courseId} - Inserting progress...`, {
      url,
      watchedTimeMills,
      completed,
    });

    const formData = new URLSearchParams();
    formData.append("url", url);
    formData.append("watched_time_mills", watchedTimeMills.toString());
    formData.append("completed", completed.toString());

    const response = await fetch(`${API_BASE_URL}/progress/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    console.log(`[API] POST /progress/${courseId} - Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] POST /progress/${courseId} - Error:`, errorText);
      return {
        success: false,
        error: errorText || "Errore durante il salvataggio del progresso",
      };
    }

    console.log(`[API] POST /progress/${courseId} - Progress saved successfully`);
    return { success: true };
  } catch (err) {
    console.error(`[API] POST /progress/${courseId} - Exception:`, err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante il salvataggio del progresso",
    };
  }
}

/**
 * Aggiorna il progresso esistente di una risorsa/video
 * PUT /progress/{id} (protected)
 */
export async function updateCourseProgress(
  courseId: number,
  url: string,
  watchedTimeMills: number,
  completed: boolean
): Promise<ApiResult<void>> {
  try {
    console.log(`[API] PUT /progress/${courseId} - Updating progress...`, {
      url,
      watchedTimeMills,
      completed,
    });

    const formData = new URLSearchParams();
    formData.append("url", url);
    formData.append("watched_time_mills", watchedTimeMills.toString());
    formData.append("completed", completed.toString());

    const response = await fetch(`${API_BASE_URL}/progress/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    console.log(`[API] PUT /progress/${courseId} - Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] PUT /progress/${courseId} - Error:`, errorText);
      return {
        success: false,
        error: errorText || "Errore durante l'aggiornamento del progresso",
      };
    }

    console.log(`[API] PUT /progress/${courseId} - Progress updated successfully`);
    return { success: true };
  } catch (err) {
    console.error(`[API] PUT /progress/${courseId} - Exception:`, err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante l'aggiornamento del progresso",
    };
  }
}

/**
 * Salva o aggiorna il progresso (usa POST se nuovo, PUT se esistente)
 * Helper function che decide automaticamente quale endpoint usare
 */
export async function saveCourseProgress(
  courseId: number,
  url: string,
  watchedTimeMills: number,
  completed: boolean,
  isExisting: boolean
): Promise<ApiResult<void>> {
  if (isExisting) {
    return await updateCourseProgress(courseId, url, watchedTimeMills, completed);
  } else {
    return await insertCourseProgress(courseId, url, watchedTimeMills, completed);
  }
}

/**
 * Elimina il progresso di una risorsa/video
 * DELETE /progress/{id} (protected)
 */
export async function deleteCourseProgress(
  courseId: number,
  url: string
): Promise<ApiResult<void>> {
  try {
    console.log(`[API] DELETE /progress/${courseId} - Deleting progress...`, { url });

    const formData = new URLSearchParams();
    formData.append("url", url);

    const response = await fetch(`${API_BASE_URL}/progress/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    console.log(`[API] DELETE /progress/${courseId} - Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] DELETE /progress/${courseId} - Error:`, errorText);
      return {
        success: false,
        error: errorText || "Errore durante l'eliminazione del progresso",
      };
    }

    console.log(`[API] DELETE /progress/${courseId} - Progress deleted successfully`);
    return { success: true };
  } catch (err) {
    console.error(`[API] DELETE /progress/${courseId} - Exception:`, err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Errore durante l'eliminazione del progresso",
    };
  }
}
