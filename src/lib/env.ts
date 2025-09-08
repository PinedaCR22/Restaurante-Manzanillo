// src/lib/env.ts
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  const base = raw && raw.length ? raw : 'http://localhost:3000';
  return base.replace(/\/+$/, '');
}
