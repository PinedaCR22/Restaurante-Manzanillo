import type { Gallery, GalleryImage } from "../../types/gallery";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/** Galerías activas para la landing */
export const GalleryPublicService = {
  listActiveGalleries() {
    return api<Gallery[]>("/public/gallery");
  },
  getPublicGallery(id: number) {
    return api<{ id: number; title: string; images: GalleryImage[]; layout: Gallery["layout"] }>(
      `/public/gallery/${id}`
    );
  },
};
