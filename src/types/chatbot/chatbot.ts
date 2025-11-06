// src/types/chatbot/chatbot.ts

/**
 * Configuración del chatbot (ON/OFF)
 */
export interface ChatbotSetting {
  id: number;
  isEnabled: boolean;
  updatedAt: string;
}

/**
 * Mensaje automático del chatbot
 */
export interface ChatbotMessage {
  id: number;
  kind: string; // 'saludo', 'fallback', 'despedida', etc.
  content: string;
  isActive: boolean;
  displayOrder: number;
}

/**
 * Formulario para crear/editar mensaje
 */
export interface ChatbotMessageForm {
  kind: string;
  content: string;
  isActive: boolean;
  displayOrder: number;
}

/**
 * Metadata de la respuesta del bot
 */
export interface BotReplyMeta {
  matchedQuestion?: string;
  tokens?: string[];
  query?: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

/**
 * Respuesta del chatbot al probar
 */
export interface BotReply {
  reply: string;
  type: "answer" | "fallback";
  faqId?: string;
  confidence?: number;
  meta?: BotReplyMeta;
}

/**
 * Health check del bot
 */
export interface BotHealth {
  ok: boolean;
  faqs: number;
}