import type { ContactItem } from "../../types/contact/contact";

const API_BASE = import.meta.env.VITE_API_URL;

/** Endpoints públicos de contacto */
export const ContactPublicService = {
  async list(kind?: string): Promise<ContactItem[]> {
    const qs = kind ? `?kind=${encodeURIComponent(kind)}` : "";
    const res = await fetch(`${API_BASE}/public/contact${qs}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  },
};
