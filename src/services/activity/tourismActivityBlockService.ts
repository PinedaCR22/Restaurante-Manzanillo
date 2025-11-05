import type { TourismActivityBlock } from "../../types/activity/TourismActivityBlock";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(json = true): HeadersInit {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const headers: HeadersInit = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const tourismActivityBlockService = {
  /** 📋 Listar bloques de una actividad turística */
  async list(activityId: number): Promise<TourismActivityBlock[]> {
    const res = await fetch(
      `${BASE_URL}/tourism-activities/${activityId}/blocks`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok)
      throw new Error("Error al obtener los bloques de la actividad turística");
    return res.json();
  },

  /** ➕ Crear un nuevo bloque */
  async create(
    activityId: number,
    data: Partial<TourismActivityBlock>
  ): Promise<TourismActivityBlock> {
    const res = await fetch(
      `${BASE_URL}/tourism-activities/${activityId}/blocks`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!res.ok)
      throw new Error("Error al crear el bloque de la actividad turística");
    return res.json();
  },

  /** ✏️ Actualizar bloque */
  async update(
    id: number,
    data: Partial<TourismActivityBlock>
  ): Promise<TourismActivityBlock> {
    const res = await fetch(`${BASE_URL}/tourism-activities/blocks/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok)
      throw new Error("Error al actualizar el bloque de la actividad turística");
    return res.json();
  },

  /** 🗑️ Eliminar bloque */
  async remove(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/tourism-activities/blocks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al eliminar el bloque de la actividad turística");
    return res.json();
  },

  /** 🖼️ Subir imagen de un bloque turístico */
  async uploadImage(
    blockId: number,
    file: File
  ): Promise<{ image_path: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/tourism-activities/blocks/${blockId}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir la imagen del bloque turístico");
    return res.json();
  },
};
