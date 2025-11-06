import { useEffect, useState } from "react";
import type { ChatbotSetting, ChatbotMessage, ChatbotMessageForm } from "../../types/chatbot/chatbot";
import { chatbotService } from "../../services/chatbot/chatbotService";
import { useToast } from "../useToast";

export function useChatbotAdmin() {
  const [setting, setSetting] = useState<ChatbotSetting | null>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll(): Promise<void> {
    try {
      setLoading(true);
      const [settingData, messagesData] = await Promise.all([
        chatbotService.getSetting(),
        chatbotService.getMessages(),
      ]);
      setSetting(settingData);
      setMessages(messagesData);
    } catch {
      push({ type: "error", title: "Error al cargar configuración del chatbot" });
    } finally {
      setLoading(false);
    }
  }

  async function toggleChatbot(isEnabled: boolean): Promise<void> {
    const updated = await chatbotService.updateSetting(isEnabled);
    setSetting((prev) => (prev ? { ...prev, isEnabled: updated.isEnabled } : null));
  }

  async function createMessage(form: ChatbotMessageForm): Promise<void> {
    const created = await chatbotService.createMessage(form);
    setMessages((prev) => [...prev, created]);
  }

  async function updateMessage(id: number, form: Partial<ChatbotMessageForm>): Promise<void> {
    const updated = await chatbotService.updateMessage(id, form);
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }

  async function deleteMessage(id: number): Promise<void> {
    await chatbotService.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  async function reloadIndex(): Promise<void> {
    await chatbotService.reloadIndex();
    push({ type: "success", title: "Índice recargado" });
  }

  const nextOrder = messages.length > 0 ? Math.max(...messages.map((m) => m.displayOrder)) + 1 : 1;

  return { setting, messages, loading, toggleChatbot, createMessage, updateMessage, deleteMessage, reloadIndex, nextOrder, reload: loadAll };
}
