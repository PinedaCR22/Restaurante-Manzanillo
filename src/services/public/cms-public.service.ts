// src/services/public/cms.public.service.ts
import type { PageSection, ContentBlock } from "../../types/cms";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Convierte /uploads/... a URL absoluta (con cache-busting opcional) */
export function fileURL(relPath?: string | null, bust = false) {
  if (!relPath) return "";
  const url = `${API_BASE}${relPath}`;
  return bust ? `${url}?v=${Date.now()}` : url;
}

/**
 * Endpoints públicos del CMS.
 * GET /public/cms/section?key=mudecoop|turismo
 */
export const CmsPublicService = {
  async getSectionByKey(
    key: "mudecoop" | "turismo",
  ): Promise<PageSection & { blocks: ContentBlock[] }> {
    const res = await fetch(`${API_BASE}/public/cms/section?key=${encodeURIComponent(key)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  },
};
