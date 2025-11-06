import type { Notification } from "../../types/notifications/notification";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

let loadingPromise: Promise<Notification[]> | null = null;

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      loadingPromise = null;

      if (res.status === 401)
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      if (!res.ok)
        throw new Error(`Error al obtener notificaciones (${res.status})`);

      const data = (await res.json()) as Notification[];

      // 🔹 eliminar duplicados por id
      const unique = Array.from(new Map(data.map((n) => [n.id, n])).values());
      return unique;
    })();

    return loadingPromise;
  },

  async markAsRead(id: number): Promise<Notification> {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error(`Error al marcar notificación como leída (${res.status})`);
    return res.json();
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error(`Error al eliminar la notificación (${res.status})`);
  },

  async create(data: {
    category: string;
    title: string;
    message: string;
    type?: "EMAIL" | "PUSH" | "SYSTEM";
    restaurant_reservation_id?: number;
    activity_reservation_id?: number;
    user_id?: number;
    reservation_url?: string;
  }) {
    const res = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Error creando notificación:", errorText);
      throw new Error(`Error creando notificación (${res.status})`);
    }

    return res.json();
  },
};
