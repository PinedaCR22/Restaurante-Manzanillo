import type { ContactForm, ContactItem } from "../../types/contact/contact";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

console.log("🔧 [ContactService] API_BASE:", API_BASE);

// --- helpers ---
function getToken(): string {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    "";
  
  console.log("🔑 [ContactService] Token encontrado:", token ? `${token.substring(0, 20)}...` : "❌ NO HAY TOKEN");
  return token;
}

function isFormData(v: unknown): v is FormData {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log("✅ [ContactService] Header Authorization agregado");
  } else if (!token) {
    console.warn("⚠️ [ContactService] NO HAY TOKEN para agregar");
  }

  if (!isFormData(init.body)) {
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
  }

  const url = `${API_BASE}${path}`;
  console.log(`📡 [ContactService] ${init.method || "GET"} ${url}`);

  const res = await fetch(url, { ...init, headers });
  
  console.log(`📥 [ContactService] Response status: ${res.status}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`❌ [ContactService] Error response:`, text);
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }

  if (res.status === 204) {
    console.log("✅ [ContactService] 204 No Content");
    return undefined as unknown as T;
  }

  const data = await res.json();
  console.log("✅ [ContactService] Data received:", data);
  return data as T;
}

// --- service ---
export const ContactService = {
  list(params?: { kind?: string; active?: boolean }) {
    const qs = new URLSearchParams();
    if (params?.kind) qs.set("kind", params.kind);
    if (typeof params?.active === "boolean")
      qs.set("active", String(params.active));
    const q = qs.toString();
    return api<ContactItem[]>(`/contact${q ? `?${q}` : ""}`);
  },

  get(id: number) {
    return api<ContactItem>(`/contact/${id}`);
  },

  create(payload: ContactForm) {
    return api<ContactItem>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: ContactForm) {
    return api<ContactItem>(`/contact/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  updateVisibility(id: number, isActive: boolean) {
    return api<ContactItem>(`/contact/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  },

  updateOrder(id: number, displayOrder: number) {
    return api<ContactItem>(`/contact/${id}/order`, {
      method: "PATCH",
      body: JSON.stringify({ displayOrder }),
    });
  },

  remove(id: number) {
    return api<{ ok: true }>(`/contact/${id}`, { method: "DELETE" });
  },
};