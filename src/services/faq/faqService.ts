// src/services/faq/faqService.ts

import type { FaqItem, CreateFaqDto, UpdateFaqDto } from "../../types/faqs/faq";

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

export const faqService = {
  /**
   * Listar todas las FAQs (admin)
   */
  getAll(): Promise<FaqItem[]> {
    return api<FaqItem[]>("/faq");
  },

  /**
   * Obtener una FAQ por ID
   */
  getById(id: number): Promise<FaqItem> {
    return api<FaqItem>(`/faq/${id}`);
  },

  /**
   * Crear nueva FAQ
   */
  create(data: CreateFaqDto): Promise<FaqItem> {
    return api<FaqItem>("/faq", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar FAQ existente
   */
  update(id: number, data: UpdateFaqDto): Promise<FaqItem> {
    return api<FaqItem>(`/faq/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar FAQ
   */
  remove(id: number): Promise<{ deleted: boolean }> {
    return api<{ deleted: boolean }>(`/faq/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Listar FAQs públicas (solo visibles)
   */
  getPublic(): Promise<FaqItem[]> {
    return api<FaqItem[]>("/public/faq");
  },
};