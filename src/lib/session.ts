// src/lib/session.ts

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'authUser';

// Tokens
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null): void {
  try {
    if (token != null) {
      localStorage.setItem(ACCESS_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }
  } catch  {
    // Ignorar errores de quota / disponibilidad
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token != null) {
      localStorage.setItem(REFRESH_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_KEY);
    }
  } catch {
    // Ignorar errores de quota / disponibilidad
  }
}

// Usuario
export function getUser<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setUser<T = unknown>(user: T | null): void {
  try {
    if (user != null) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch{
    // Ignorar errores de quota / disponibilidad
  }
}

export function clearSession(): void {
  setAccessToken(null);
  setRefreshToken(null);
  setUser(null);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
