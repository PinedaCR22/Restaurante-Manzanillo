import type { CoopActivity } from "../../types/activity/CoopActivity";
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const coopPublicService = {
  async list(): Promise<CoopActivity[]> {
    const res = await fetch(`${API}/public/coop-activities`);
    if (!res.ok) throw new Error("Error al listar actividades");
    return res.json();
  },

  async get(id: number): Promise<CoopActivity> {
    const res = await fetch(`${API}/public/coop-activities/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la actividad");
    return res.json();
  },

  async createReservation(id: number, payload: { full_name: string; email?: string; phone?: string; note?: string }) {
    const res = await fetch(`${API}/public/coop-activities/${id}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo enviar la reserva");
    return res.json();
  },
};
