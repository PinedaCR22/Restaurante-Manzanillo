import type { Gallery, GalleryImage } from "../../types/gallery";

const API_BASE = import.meta.env.VITE_API_URL;

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Ensure single slash between API_BASE and path
  const url = `${API_BASE}/${path.replace(/^\/+/, "")}`;
  const res = await fetch(url, {
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
