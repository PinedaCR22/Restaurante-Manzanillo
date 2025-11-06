import type { TourismActivity } from "../../types/activity/TourismActivity";
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const tourismPublicService = {
  async list(): Promise<TourismActivity[]> {
    const res = await fetch(`${API}/public/tourism-activities`);
    if (!res.ok) throw new Error("Error al listar actividades");
    return res.json();
  },

  async get(id: number): Promise<TourismActivity> {
    const res = await fetch(`${API}/public/tourism-activities/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la actividad");
    return res.json();
  },
};
