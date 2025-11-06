import type { RestaurantReservation } from "../../types/restaurant-reservations/RestaurantReservation";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken(): string {
  const envToken =
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_DEV_TOKEN ?? "";
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    envToken ||
    ""
  );
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const url = `${API_BASE}${path}`;

  let caller: Record<string, string> = {};
  if (init.headers instanceof Headers) caller = Object.fromEntries(init.headers.entries());
  else if (Array.isArray(init.headers)) caller = Object.fromEntries(init.headers);
  else if (init.headers) caller = { ...(init.headers as Record<string, string>) };

  const headers: Record<string, string> = { ...caller };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    headers["Accept"] = headers["Accept"] ?? "application/json";
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 401) throw new Error(`No autorizado (401). ${text}`);
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json() as Promise<T>;
}

export const restaurantReservationService = {
  getAll(): Promise<RestaurantReservation[]> {
    return api<RestaurantReservation[]>("/restaurant-reservations");
  },

  create(data: Partial<RestaurantReservation>) {
    return api<RestaurantReservation>("/restaurant-reservations", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  },

  update(id: number, data: Partial<RestaurantReservation>) {
    return api<RestaurantReservation>(`/restaurant-reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updateStatus(id: number, status: string, confirmedBy: number) {
    return api<RestaurantReservation>(`/restaurant-reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, confirmedBy }),
    });
  },

  remove(id: number) {
    return api<{ message: string }>(`/restaurant-reservations/${id}`, {
      method: "DELETE",
    });
  },

  // 🆕 Obtener horarios disponibles para una fecha
  async getAvailableHours(date: string): Promise<string[]> {
    const response = await api<{ date: string; hours: string[] }>(
      `/restaurant-reservations/available-hours?date=${date}`
    );
    return response.hours;
  },

  // 🆕 Obtener mesas disponibles para fecha/hora/zona
  async getAvailableTables(date: string, time: string, zone?: string): Promise<number[]> {
    const zoneParam = zone ? `&zone=${encodeURIComponent(zone)}` : '';
    const response = await api<{ date: string; time: string; zone: string; tables: number[] }>(
      `/restaurant-reservations/available-tables?date=${date}&time=${time}${zoneParam}`
    );
    return response.tables;
  },
};