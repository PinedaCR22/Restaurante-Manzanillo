// src/services/chatbot/chatbotService.ts

import type {
  ChatbotSetting,
  ChatbotMessage,
  ChatbotMessageForm,
  BotReply,
  BotHealth,
} from "../../types/chatbot/chatbot";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * Respuesta de debug del chatbot
 */
export interface BotDebugResponse {
  query: string;
  tokens: string[];
  results: Array<{
    faqId: number;
    question: string;
    score: number;
  }>;
  threshold: number;
  [key: string]: unknown;
}

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

export const chatbotService = {
  /**
   * Health check
   */
  getHealth(): Promise<BotHealth> {
    return api<BotHealth>("/bot/health");
  },

  /**
   * Obtener configuración (ON/OFF)
   */
  getSetting(): Promise<ChatbotSetting> {
    return api<ChatbotSetting>("/bot/setting");
  },

  /**
   * Actualizar configuración (ON/OFF)
   */
  updateSetting(isEnabled: boolean): Promise<{ ok: boolean; isEnabled: boolean }> {
    return api<{ ok: boolean; isEnabled: boolean }>("/bot/setting", {
      method: "PATCH",
      body: JSON.stringify({ isEnabled }),
    });
  },

  /**
   * Listar mensajes automáticos
   */
  getMessages(): Promise<ChatbotMessage[]> {
    return api<ChatbotMessage[]>("/bot/messages");
  },

  /**
   * Crear mensaje
   */
  createMessage(data: ChatbotMessageForm): Promise<ChatbotMessage> {
    return api<ChatbotMessage>("/bot/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar mensaje
   */
  updateMessage(id: number, data: Partial<ChatbotMessageForm>): Promise<ChatbotMessage> {
    return api<ChatbotMessage>(`/bot/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar mensaje
   */
  deleteMessage(id: number): Promise<{ deleted: boolean }> {
    return api<{ deleted: boolean }>(`/bot/messages/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Recargar índice de búsqueda
   */
  reloadIndex(): Promise<{ ok: boolean }> {
    return api<{ ok: boolean }>("/bot/reload", {
      method: "POST",
    });
  },

  /**
   * Probar el chatbot con un mensaje
   */
  testReply(message: string): Promise<BotReply> {
    return api<BotReply>("/bot/reply", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Debug del chatbot
   */
  debug(message: string): Promise<BotDebugResponse> {
    return api<BotDebugResponse>("/bot/debug", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};