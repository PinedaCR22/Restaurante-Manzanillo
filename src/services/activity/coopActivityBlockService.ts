import type { CoopActivityBlock } from "../../types/activity/CoopActivityBlock";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(json = true): HeadersInit {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const headers: HeadersInit = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const coopActivityBlockService = {
  /** 📋 Listar bloques de una actividad cooperativa */
  async list(activityId: number): Promise<CoopActivityBlock[]> {
    const res = await fetch(`${BASE_URL}/coop-activities/${activityId}/blocks`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al obtener los bloques de la actividad cooperativa");
    return res.json();
  },

  /** ➕ Crear un nuevo bloque */
  async create(
    activityId: number,
    data: Partial<CoopActivityBlock>
  ): Promise<CoopActivityBlock> {
    const res = await fetch(`${BASE_URL}/coop-activities/${activityId}/blocks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok)
      throw new Error("Error al crear el bloque de la actividad cooperativa");
    return res.json();
  },

  /** ✏️ Actualizar bloque */
  async update(
    id: number,
    data: Partial<CoopActivityBlock>
  ): Promise<CoopActivityBlock> {
    const res = await fetch(`${BASE_URL}/coop-activities/blocks/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok)
      throw new Error("Error al actualizar el bloque de la actividad cooperativa");
    return res.json();
  },

  /** 🗑️ Eliminar bloque */
  async remove(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/coop-activities/blocks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al eliminar el bloque de la actividad cooperativa");
    return res.json();
  },

  /** 🖼️ Subir imagen de un bloque cooperativo */
  async uploadImage(
    blockId: number,
    file: File
  ): Promise<{ image_path: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/coop-activities/blocks/${blockId}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir la imagen del bloque cooperativo");
    return res.json();
  },
};
