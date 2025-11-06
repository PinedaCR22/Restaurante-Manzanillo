export interface ChatbotSetting {
  id: number;
  isEnabled: boolean;
  updatedAt: string;
}

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

export interface BotHealth {
  ok: boolean;
  faqs: number;
}
