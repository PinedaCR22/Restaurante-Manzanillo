// src/hooks/chatbot/useChatbotAdmin.ts

import { useEffect, useState } from "react";
import type { ChatbotSetting, ChatbotMessage, ChatbotMessageForm } from "../../types/chatbot/chatbot";
import { chatbotService } from "../../services/chatbot/hatbotService";
import { useToast } from "../useToast";

export function useChatbotAdmin() {
  const [setting, setSetting] = useState<ChatbotSetting | null>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      const [settingData, messagesData] = await Promise.all([
        chatbotService.getSetting(),
        chatbotService.getMessages(),
      ]);
      setSetting(settingData);
      setMessages(messagesData);
    } catch (err) {
      console.error("Error cargando configuración del chatbot:", err);
      push({ type: "error", title: "Error al cargar configuración" });
    } finally {
      setLoading(false);
    }
  }

  async function toggleChatbot(isEnabled: boolean) {
    try {
      const updated = await chatbotService.updateSetting(isEnabled);
      setSetting((prev) => (prev ? { ...prev, isEnabled: updated.isEnabled } : null));
      push({
        type: "success",
        title: `Chatbot ${isEnabled ? "activado" : "desactivado"}`,
      });
    } catch (err) {
      console.error("Error cambiando estado del chatbot:", err);
      push({ type: "error", title: "Error al cambiar estado" });
      throw err;
    }
  }

  async function createMessage(form: ChatbotMessageForm) {
    try {
      const created = await chatbotService.createMessage(form);
      setMessages((prev) => [...prev, created]);
      push({ type: "success", title: "Mensaje creado", message: "El mensaje se guardó correctamente" });
    } catch (err) {
      console.error("Error creando mensaje:", err);
      push({ type: "error", title: "Error al crear mensaje" });
      throw err;
    }
  }

  async function updateMessage(id: number, form: Partial<ChatbotMessageForm>) {
    try {
      const updated = await chatbotService.updateMessage(id, form);
      setMessages((prev) => prev.map((msg) => (msg.id === id ? updated : msg)));
      push({ type: "success", title: "Mensaje actualizado" });
    } catch (err) {
      console.error("Error actualizando mensaje:", err);
      push({ type: "error", title: "Error al actualizar mensaje" });
      throw err;
    }
  }

  async function deleteMessage(id: number) {
    try {
      await chatbotService.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      push({ type: "success", title: "Mensaje eliminado" });
    } catch (err) {
      console.error("Error eliminando mensaje:", err);
      push({ type: "error", title: "Error al eliminar mensaje" });
      throw err;
    }
  }

  async function reloadIndex() {
    try {
      await chatbotService.reloadIndex();
      push({
        type: "success",
        title: "Índice recargado",
        message: "El chatbot actualizó su base de conocimientos",
      });
    } catch (err) {
      console.error("Error recargando índice:", err);
      push({ type: "error", title: "Error al recargar índice" });
      throw err;
    }
  }

  const nextOrder =
    messages.length > 0 ? Math.max(...messages.map((m) => m.displayOrder)) + 1 : 1;

  return {
    setting,
    messages,
    loading,
    toggleChatbot,
    createMessage,
    updateMessage,
    deleteMessage,
    reloadIndex,
    nextOrder,
    reload: loadAll,
  };
}