// src/helpers/media.ts
const RAW = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Quita slashes finales duplicados
export const API_URL = RAW.replace(/\/+$/, "");

// Extrae origin y path del API_URL
let ORIGIN = API_URL;
let API_PATH = "";
try {
  const u = new URL(API_URL);
  ORIGIN = u.origin;
  API_PATH = u.pathname.replace(/\/+$/, ""); // p.ej. "/api" o ""
} catch {
  // si no es una URL válida, lo asumimos como origin simple
  ORIGIN = API_URL;
  API_PATH = "";
}

/** Une paths con cuidado de los "/" */
function join(base: string, p: string): string {
  if (!p) return base;
  if (p.startsWith("http") || p.startsWith("data:")) return p;
  const b = base.replace(/\/+$/, "");
  const s = p.startsWith("/") ? p : `/${p}`;
  return `${b}${s}`;
}

/** Devuelve una URL absoluta "segura" para un path de imagen. */
export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  // Caso típico: backend sirve /uploads en el root (no bajo /api)
  return join(ORIGIN, path);
}

/**
 * Candidatos para intentar cargar una imagen, cubriendo:
 * - ORIGIN + path           (p.ej. http://host:3000/uploads/..)
 * - ORIGIN + API_PATH + path (por si está servido bajo /api/uploads/..)
 * Devuelve únicos en orden.
 */
export function resolveImageCandidates(path?: string | null): string[] {
  if (!path) return [];
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return [path];

  const withRoot = join(ORIGIN, path);
  const withApi = API_PATH ? join(ORIGIN, join(API_PATH, path)) : withRoot;

  const set = new Set<string>([withRoot, withApi]);
  return Array.from(set);
}
