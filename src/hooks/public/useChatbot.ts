import { useState, useCallback, useEffect } from "react";
import { BotPublicService } from "../../services/public/bot-public.service";
import type { BotReply } from "../../types/chatbot/chatbot";
import type { ChatCrabMessage } from "../../chat/ChatCrab";

export function useChatbot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botEnabled, setBotEnabled] = useState(false);
  const [healthChecked, setHealthChecked] = useState(false);

  // Health check al montar
  useEffect(() => {
    (async () => {
      try {
        const health = await BotPublicService.checkHealth();
        console.log("🤖 [useChatbot] Health check:", health);
        setBotEnabled(health.ok && health.faqs > 0);
      } catch (error) {
        console.warn("⚠️ [useChatbot] Health check failed:", error);
        setBotEnabled(false);
      } finally {
        setHealthChecked(true);
      }
    })();
  }, []);

  const sendMessage = useCallback(async (userText: string): Promise<ChatCrabMessage> => {
    console.log("🔄 [useChatbot] Sending user message:", userText);
    
    try {
      setLoading(true);
      setError(null);

      const botReply: BotReply = await BotPublicService.sendMessage(userText);

      console.log("✅ [useChatbot] Bot responded:", botReply);

      const assistantMessage: ChatCrabMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: botReply.reply || "Lo siento, no pude procesar tu mensaje.",
        ts: Date.now(),
      };

      if (botReply.type === "fallback") {
        console.log("⚠️ [useChatbot] Fallback response triggered");
      }

      if (botReply.confidence !== undefined) {
        console.log(`📊 [useChatbot] Confidence: ${botReply.confidence}%`);
      }

      if (botReply.meta?.matchedQuestion) {
        console.log(`🎯 [useChatbot] Matched: "${botReply.meta.matchedQuestion}"`);
      }

      return assistantMessage;
    } catch (error) {
      console.error("❌ [useChatbot] Error:", error);
      
      const errorText = error instanceof Error ? error.message : "Error desconocido";
      setError(errorText);

      return {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "¡Ups! 🦀 Parece que hubo un problema. ¿Podrías intentar de nuevo en un momento?",
        ts: Date.now(),
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    loading,
    error,
    botEnabled,
    healthChecked,
  };
}