import type { BotReply } from "../../types/chatbot/chatbot";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

console.log("🔧 [BotPublicService] API_BASE:", API_BASE);

export interface InitialMessage {
  id: number;
  kind: string;
  content: string;
  displayOrder: number;
}

export const BotPublicService = {
  /**
   * Obtiene los mensajes iniciales/bienvenida del chatbot
   */
  async getInitialMessages(): Promise<InitialMessage[]> {
    const url = `${API_BASE}/bot/messages/initial`;
    
    console.log("📡 [BotPublicService] GET", url);

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("❌ [BotPublicService] Error getting messages:", text);
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const data: unknown = await res.json();
      console.log("✅ [BotPublicService] Initial messages:", data);

      // Validar y filtrar mensajes activos
      const messages = Array.isArray(data) ? data : [];
      return messages
        .filter((msg: unknown): msg is InitialMessage => {
          return (
            typeof msg === "object" &&
            msg !== null &&
            "id" in msg &&
            "content" in msg &&
            "displayOrder" in msg &&
            "isActive" in msg &&
            (msg as { isActive: unknown }).isActive === true
          );
        })
        .sort((a, b) => a.displayOrder - b.displayOrder);
    } catch (error) {
      console.error("💥 [BotPublicService] Error fetching messages:", error);
      return [];
    }
  },

  /**
   * Envía un mensaje del usuario y obtiene la respuesta del bot
   */
  async sendMessage(userMessage: string): Promise<BotReply> {
    const url = `${API_BASE}/bot/reply`;
    
    console.log("📡 [BotPublicService] POST", url);
    console.log("💬 [BotPublicService] User message:", userMessage);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log("📥 [BotPublicService] Response status:", res.status);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("❌ [BotPublicService] Error response:", text);
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const data: unknown = await res.json();
      console.log("✅ [BotPublicService] Bot reply:", data);

      // Validar estructura de BotReply
      if (
        typeof data === "object" &&
        data !== null &&
        "reply" in data &&
        "type" in data
      ) {
        return data as BotReply;
      }

      throw new Error("Respuesta del bot en formato inválido");
    } catch (error) {
      console.error("💥 [BotPublicService] Fetch error:", error);
      throw error;
    }
  },

  /**
   * Verifica el estado de salud del bot
   */
  async checkHealth(): Promise<{ ok: boolean; faqs: number }> {
    const url = `${API_BASE}/bot/health`;
    
    console.log("📡 [BotPublicService] GET", url);

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: unknown = await res.json();
      console.log("✅ [BotPublicService] Health:", data);

      // Validar estructura de health check
      if (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        "faqs" in data &&
        typeof (data as { ok: unknown }).ok === "boolean" &&
        typeof (data as { faqs: unknown }).faqs === "number"
      ) {
        return data as { ok: boolean; faqs: number };
      }

      return { ok: false, faqs: 0 };
    } catch (error) {
      console.error("❌ [BotPublicService] Health check failed:", error);
      return { ok: false, faqs: 0 };
    }
  },
};