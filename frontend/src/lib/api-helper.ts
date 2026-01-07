import { authClient } from "./auth-client";

/**
 * Helper per fare richieste autenticate con JWT al backend Go
 * Usa il plugin JWT di Better Auth per ottenere un token JWT valido
 * e lo aggiunge automaticamente nell'header Authorization
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ottieni il token JWT usando il metodo token() del plugin jwtClient
  const tokenResponse = await authClient.token();
  
  if (tokenResponse.error) {
    console.error("[fetchWithAuth] Error getting JWT token:", tokenResponse.error);
    throw new Error("Non autenticato");
  }
  
  if (!tokenResponse.data?.token) {
    console.error("[fetchWithAuth] No JWT token in response");
    throw new Error("Token JWT non disponibile");
  }

  const jwtToken = tokenResponse.data.token;
  console.log("[fetchWithAuth] JWT token obtained successfully");

  const headers = new Headers(options.headers);
  
  // Aggiungi il token JWT nell'header Authorization
  headers.set("Authorization", `Bearer ${jwtToken}`);
  
  // Se non ci sono headers Content-Type e c'è un body, usa application/x-www-form-urlencoded
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  }

  // Includi i cookies nella richiesta (per cross-origin)
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  return response;
}

/**
 * Helper per GET request autenticate
 */
export async function getAuth<T>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  
  // Handle empty or null responses
  if (!text || text.trim() === "" || text.trim() === "null") {
    return null as T;
  }

  return JSON.parse(text) as T;
}

/**
 * Helper per POST request autenticate con form data
 */
export async function postAuth<T>(
  url: string,
  data: Record<string, string>
): Promise<T> {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  // For redirects or successful posts without body
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as T;
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return null as T;
  }

  return JSON.parse(text) as T;
}

/**
 * Helper per PUT request autenticate con form data
 */
export async function putAuth<T>(
  url: string,
  data: Record<string, string>
): Promise<T> {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as T;
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return null as T;
  }

  return JSON.parse(text) as T;
}

/**
 * Helper per DELETE request autenticate
 */
export async function deleteAuth(url: string, data?: Record<string, string>): Promise<void> {
  const options: RequestInit = {
    method: "DELETE",
  };

  if (data) {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    options.body = formData.toString();
  }

  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
}

