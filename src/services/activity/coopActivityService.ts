import type { CoopActivity } from "../../types/activity/CoopActivity";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(json = true): HeadersInit {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const headers: HeadersInit = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const coopActivityService = {
  async list(): Promise<CoopActivity[]> {
    const res = await fetch(`${BASE_URL}/coop-activities`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener actividades cooperativas");
    return res.json();
  },

  async get(id: number): Promise<CoopActivity> {
    const res = await fetch(`${BASE_URL}/coop-activities/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener la actividad");
    return res.json();
  },

  /** ✅ Subir imagen (actualizado) */
  async uploadImage(activityId: number, file: File): Promise<CoopActivity> {
    const formData = new FormData();
    formData.append("activityId", activityId.toString());
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/coop-activities/upload`, {
      method: "POST",
      headers: getAuthHeaders(false),
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir imagen");
    return res.json();
  },

  async create(data: Omit<CoopActivity, "id" | "created_at" | "updated_at">): Promise<CoopActivity> {
    const res = await fetch(`${BASE_URL}/coop-activities`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear la actividad");
    return res.json();
  },

  async update(id: number, data: Partial<CoopActivity>): Promise<CoopActivity> {
    const res = await fetch(`${BASE_URL}/coop-activities/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar la actividad");
    return res.json();
  },

  async remove(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/coop-activities/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar la actividad");
    return res.json();
  },
};
