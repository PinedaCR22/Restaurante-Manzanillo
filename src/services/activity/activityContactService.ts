import type { ActivityContact } from "../../types/activity/ActivityContact";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const activityContactService = {
  /** 📩 Listar contactos de una actividad */
  async list(activityId: number): Promise<ActivityContact[]> {
    const res = await fetch(`${BASE_URL}/activity-contacts/${activityId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener los contactos de la actividad");
    return res.json();
  },

  /** 📨 Crear un contacto (desde público o pruebas) */
  async create(activityId: number, data: Partial<ActivityContact>): Promise<ActivityContact> {
    const res = await fetch(`${BASE_URL}/activity-contacts/${activityId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear el contacto");
    return res.json();
  },

  /** ❌ Eliminar un contacto */
  async remove(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/activity-contacts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar el contacto");
    return res.json();
  },
};
