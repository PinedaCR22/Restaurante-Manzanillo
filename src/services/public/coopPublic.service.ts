// ✅ src/services/public/coopPublic.service.ts
import type { CoopActivity } from "../../types/activity/CoopActivity";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Estructura del formulario de contacto para actividades
 * Debe coincidir con el DTO del backend: CreateActivityContactDto
 */
export interface ContactFormData {
  full_name: string;
  email?: string;
  phone?: string;
  message?: string; // 👈 Coincide con el backend
}

export const coopPublicService = {
  /**
   * Listar todas las actividades activas de cooperativa
   */
  async list(): Promise<CoopActivity[]> {
    const res = await fetch(`${API}/coop-activities/public`);
    if (!res.ok) throw new Error("Error al listar actividades");
    return res.json();
  },

  /**
   * Obtener una actividad específica con sus bloques
   */
  async get(id: number): Promise<CoopActivity> {
    const res = await fetch(`${API}/coop-activities/public/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener la actividad");
    return res.json();
  },

  /**
   * Obtener actividad por slug/título
   */
  async getBySlug(slug: string): Promise<CoopActivity | null> {
    const activities = await this.list();
    const found = activities.find(
      (act) => this.slugify(act.title) === slug
    );
    return found || null;
  },

  /**
   * 🟢 Enviar formulario de contacto asociado a una actividad (landing pública)
   * Endpoint: POST /activity-contacts/:activityId
   */
  async createActivityContact(
    activityId: number,
    payload: ContactFormData
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API}/activity-contacts/${activityId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `No se pudo enviar el formulario de contacto. Servidor respondió: ${res.status} ${text}`
      );
    }

    return res.json();
  },

  /**
   * Helper: convertir título a slug (para URLs amigables)
   */
  slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },
};
