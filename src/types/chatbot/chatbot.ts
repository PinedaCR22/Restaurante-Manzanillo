// ========================================
// Configuración del Chatbot
// ========================================

export interface ChatbotSetting {
  id: number;
  isEnabled: boolean;
  updatedAt: string;
}

// ========================================
// Mensajes Automáticos (Bienvenida/Fallback)
// ========================================

export interface ChatbotMessage {
  id: number;
  kind: string;
  content: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ChatbotMessageForm {
  kind: string;
  content: string;
  isActive: boolean;
  displayOrder: number;
}

// ========================================
// Respuestas del Bot
// ========================================

export interface BotReplyMeta {
  matchedQuestion?: string;
  tokens?: string[];
  query?: string;
}

export interface BotReply {
  reply: string;
  type: "answer" | "fallback";
  faqId?: string;
  confidence?: number;
  meta?: BotReplyMeta;
}

// ========================================
// Health Check
// ========================================

export interface BotHealth {
  ok: boolean;
  faqs: number;
}