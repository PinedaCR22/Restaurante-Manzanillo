import type { Gallery, GalleryForm, GalleryImage } from "../../types/gallery";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken(): string {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_DEV_TOKEN ||
    ""
  );
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let caller: Record<string, string> = {};
  if (init.headers) {
    if (init.headers instanceof Headers) caller = Object.fromEntries(init.headers.entries());
    else if (Array.isArray(init.headers)) caller = Object.fromEntries(init.headers);
    else caller = { ...(init.headers as Record<string, string>) };
  }

  const headers: Record<string, string> = { ...caller };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    headers["Accept"] = headers["Accept"] ?? "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  // algunos endpoints podrían responder 204 sin body
  if (res.status === 204) return undefined as unknown as T;

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* noop */
    }
    throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export const GalleryService = {
  // galleries
  listGalleries(active?: boolean) {
    const qs = typeof active === "boolean" ? `?active=${active}` : "";
    return api<Gallery[]>(`/gallery${qs}`);
  },
  createGallery(payload: GalleryForm) {
    return api<Gallery>(`/gallery`, { method: "POST", body: JSON.stringify(payload) });
  },
  updateGallery(id: number, payload: GalleryForm) {
    return api<Gallery>(`/gallery/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  updateGalleryVisibility(id: number, isActive: boolean) {
    return api<Gallery>(`/gallery/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  },
  deleteGallery(id: number) {
    return api<{ ok: true }>(`/gallery/${id}`, { method: "DELETE" });
  },

  // images
  listImages(galleryId: number) {
    return api<GalleryImage[]>(`/gallery/${galleryId}/images`);
  },
  uploadImage(galleryId: number, file: File) {
    const fd = new FormData();
    fd.append("image", file);
    return api<GalleryImage>(`/gallery/${galleryId}/images`, { method: "POST", body: fd });
  },
  // estos dos pueden no existir en el backend; si fallan, lo manejamos en el hook
  updateImageVisibility(imageId: number, isVisible: boolean) {
    return api<GalleryImage>(`/gallery/images/${imageId}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isVisible }),
    });
  },
  updateImageOrder(imageId: number, displayOrder: number) {
    return api<GalleryImage>(`/gallery/images/${imageId}/order`, {
      method: "PATCH",
      body: JSON.stringify({ displayOrder }),
    });
  },
  deleteImage(imageId: number) {
    return api<{ ok: true }>(`/gallery/images/${imageId}`, { method: "DELETE" });
  },
};
