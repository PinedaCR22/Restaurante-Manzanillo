// src/services/public/tourismPublic.service.ts
import type { TourismActivity } from "../../types/activity/TourismActivity";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const tourismPublicService = {
  /** 🔹 Listar todas las actividades activas (PÚBLICO) */
  async list(): Promise<TourismActivity[]> {
    const res = await fetch(`${API}/tourism-activities/public`);
    if (!res.ok) {
      console.error(`❌ Error ${res.status}: ${res.statusText}`);
      throw new Error("Error al listar actividades");
    }
    return res.json();
  },

  /** 🔹 Obtener una actividad con sus bloques (PÚBLICO) */
  async get(id: number): Promise<TourismActivity> {
    const res = await fetch(`${API}/tourism-activities/${id}`);
    if (!res.ok) {
      console.error(`❌ Error ${res.status}: ${res.statusText}`);
      if (res.status === 404) {
        throw new Error("Actividad no encontrada");
      }
      throw new Error("No se pudo obtener la actividad");
    }
    return res.json();
  },

  /** 🔹 Obtener bloques de una actividad (PÚBLICO) */
  async getBlocks(id: number): Promise<unknown[]> {
    const res = await fetch(`${API}/tourism-activities/${id}/blocks`);
    if (!res.ok) {
      console.error(`❌ Error ${res.status}: ${res.statusText}`);
      throw new Error("No se pudieron obtener los bloques");
    }
    return res.json();
  },
};