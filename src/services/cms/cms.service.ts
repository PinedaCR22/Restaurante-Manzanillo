// src/services/cms/cms.service.ts
import type { BlockForm, ContentBlock, PageSection, SectionForm } from "../../types/cms";
import type { CoreSectionKey } from "../../constants/cms";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ---- helpers ----
function getToken(): string {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    ""
  );
}
function isFormData(v: unknown): v is FormData {
  return typeof FormData !== "undefined" && v instanceof FormData;
}
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (!isFormData(init.body)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// URL absoluta para estáticos (con cache-busting opcional)
export function fileURL(relPath?: string | null, bust = false) {
  if (!relPath) return "";
  const url = `${API_BASE}${relPath}`;
  return bust ? `${url}?v=${Date.now()}` : url;
}

// Nombres fijos de las 2 secciones núcleo
const CORE: Record<CoreSectionKey, { key: CoreSectionKey; panelTitle: string }> = {
  mudecoop: { key: "mudecoop", panelTitle: "Mudecoop" },
  turismo: { key: "turismo", panelTitle: "Turismo" },
};

// ---- service ----
export const CmsService = {
  // Sections
  listSections() {
    return api<PageSection[]>("/cms/sections");
  },
  getSection(id: number) {
    return api<PageSection>(`/cms/sections/${id}`);
  },
  createSection(payload: SectionForm) {
    return api<PageSection>("/cms/sections", { method: "POST", body: JSON.stringify(payload) });
  },
  updateSection(id: number, payload: SectionForm) {
    return api<PageSection>(`/cms/sections/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  deleteSection(id: number) {
    return api<{ ok: true }>(`/cms/sections/${id}`, { method: "DELETE" });
  },

  // Blocks
  listBlocks(sectionId: number) {
    return api<ContentBlock[]>(`/cms/sections/${sectionId}/blocks`);
  },
  createBlock(sectionId: number, form: BlockForm, image?: File) {
    const fd = new FormData();
    if (image) fd.append("image", image);
    if (typeof form.title !== "undefined") fd.append("title", String(form.title ?? ""));
    if (typeof form.body !== "undefined") fd.append("body", String(form.body ?? ""));
    if (typeof form.displayOrder !== "undefined") fd.append("displayOrder", String(form.displayOrder));
    if (typeof form.isActive !== "undefined") fd.append("isActive", String(form.isActive));
    return api<ContentBlock>(`/cms/sections/${sectionId}/blocks`, { method: "POST", body: fd });
  },
  updateBlock(blockId: number, form: BlockForm) {
    return api<ContentBlock>(`/cms/sections/blocks/${blockId}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });
  },
  updateBlockImage(blockId: number, image: File) {
    const fd = new FormData();
    fd.append("image", image);
    return api<ContentBlock>(`/cms/sections/blocks/${blockId}/image`, { method: "PATCH", body: fd });
  },
  deleteBlockImage(blockId: number) {
    return api<{ ok: true }>(`/cms/sections/blocks/${blockId}/image`, { method: "DELETE" });
  },
  deleteBlock(blockId: number) {
    return api<{ ok: true }>(`/cms/sections/blocks/${blockId}`, { method: "DELETE" });
  },

  // Combo: actualizar texto y (si hay) imagen
  async updateBlockWithImage(blockId: number, form: BlockForm, image?: File | null) {
    let updated = await this.updateBlock(blockId, form);
    if (image) {
      updated = await this.updateBlockImage(blockId, image);
    }
    return updated;
  },

  // ---------- Helpers usados por el hook ----------
  /** Asegura que existan las secciones núcleo (mudecoop, turismo). Devuelve un mapa por key. */
  async ensureCoreSections(): Promise<Record<CoreSectionKey, PageSection>> {
    const existing = await this.listSections();
    const byKey = new Map<string, PageSection>();
    existing.forEach((s) => byKey.set(s.sectionKey.toLowerCase(), s));

    const result = {} as Record<CoreSectionKey, PageSection>;

    (Object.keys(CORE) as CoreSectionKey[]).forEach((key) => {
      const wanted = CORE[key];
      const found =
        byKey.get(wanted.key) ||
        existing.find((s) => s.sectionKey.toLowerCase() === wanted.key) ||
        null;

      // Guardamos un placeholder; si no está, lo crearemos abajo
      if (found) result[key] = found;
    });

    // Crear las que falten
    for (const key of Object.keys(CORE) as CoreSectionKey[]) {
      if (!result[key]) {
        const wanted = CORE[key];
        const created = await this.createSection({
          sectionKey: wanted.key,
          panelTitle: wanted.panelTitle,
          isVisible: true,
        });
        result[key] = created;
      }
    }

    return result;
  },

  /** Devuelve el id de sección para una key núcleo (creándola si no existe). */
  async getSectionIdByKey(key: CoreSectionKey): Promise<number> {
    const map = await this.ensureCoreSections();
    return map[key].id;
  },

  /** Conveniencia: crear bloque referenciando la key de sección núcleo. */
  async createBlockByKey(key: CoreSectionKey, form: BlockForm, image?: File) {
    const sectionId = await this.getSectionIdByKey(key);
    return this.createBlock(sectionId, form, image);
  },

  /** Conveniencia: listar bloques por key núcleo. */
  async listBlocksByKey(key: CoreSectionKey) {
    const sectionId = await this.getSectionIdByKey(key);
    return this.listBlocks(sectionId);
  },
};
