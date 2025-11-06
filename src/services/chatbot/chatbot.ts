// src/services/chatbot/chatbot.ts

export type BotReplyResponse = {
  reply: string;
  type: "answer" | "fallback";
  faqId?: string;
  confidence: number;
  meta?: { matchedQuestion?: string; tokens?: string[] };
};

export type FaqItem = {
  id: string;
  q: string;
  a: string;
  tags?: string[];
};

// Usa VITE_API_URL; si no está definida, usa localhost
const API_URL: string =
  (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000";

/**
 * Envía un mensaje al bot y obtiene la respuesta
 */
export async function botReply(
  message: string,
  lang: "es" | "es-cr" = "es-cr",
  timeoutMs = 8000
): Promise<BotReplyResponse> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}/bot/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${text}`);
    }

    return (await res.json()) as BotReplyResponse;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Obtiene las FAQs registradas en el bot
 */
export async function getFaqs(): Promise<FaqItem[]> {
  const res = await fetch(`${API_URL}/bot/faqs`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text}`);
  }

  return (await res.json()) as FaqItem[];
}

export default { botReply, getFaqs };
