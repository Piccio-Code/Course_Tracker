// Configurazione API - Modifica qui l'URL base del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Tipo per l'utente
export interface User {
  username: string;
  email: string;
}

// Verifica se l'utente è autenticato
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

// Login
export async function login(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
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
    return { success: false, error: err instanceof Error ? err.message : "Errore durante il login" };
  }
}

// Signup
export async function signup(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: errorText || "Errore durante la registrazione" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Errore durante la registrazione" };
  }
}

// Logout
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

