import { useState, useEffect } from "react";
import { notificationsService } from "../../services/notifications/notifications.service";
import { useToast } from "../useToast";
import type { Notification } from "../../types/notifications/notification";

/**
 * Función centralizada para eliminar duplicados
 * Usa el ID como clave única principal
 */
function removeDuplicates(notifications: Notification[]): Notification[] {
  const seen = new Map<number, Notification>();
  
  notifications.forEach((n) => {
    if (!seen.has(n.id)) {
      seen.set(n.id, n);
    }
  });
  
  return Array.from(seen.values());
}

/**
 * Hook principal para manejar notificaciones (sin duplicados)
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  /** 🔁 Cargar todas las notificaciones */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAll();

      // 🧩 Eliminar duplicados por ID únicamente
      const unique = removeDuplicates(data);

      // 🔢 Ordenar de más reciente a más antigua
      const sorted = unique.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("❌ Error cargando notificaciones:", error);
      push({
        type: "error",
        title: "Error",
        message: "No se pudieron cargar las notificaciones.",
      });
    } finally {
      setLoading(false);
    }
  };

  /** 🟢 Marcar como leída */
  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
      );
      window.dispatchEvent(new Event("notifications-updated"));
      push({
        type: "success",
        title: "Notificación actualizada",
        message: "Marcada como leída correctamente.",
      });
    } catch {
      push({
        type: "error",
        title: "Error",
        message: "No se pudo actualizar la notificación.",
      });
    }
  };

  /** ❌ Eliminar una notificación */
  const removeNotification = async (id: number) => {
    try {
      await notificationsService.remove(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      window.dispatchEvent(new Event("notifications-updated"));
      push({
        type: "success",
        title: "Eliminada",
        message: "Notificación eliminada correctamente.",
      });
    } catch {
      push({
        type: "error",
        title: "Error",
        message: "No se pudo eliminar la notificación.",
      });
    }
  };

  /** 🗑️ Eliminar todas */
  const removeAll = async () => {
    try {
      await Promise.all(
        notifications.map((n) => notificationsService.remove(n.id))
      );
      setNotifications([]);
      window.dispatchEvent(new Event("notifications-updated"));
      push({
        type: "success",
        title: "Notificaciones eliminadas",
        message: "Se eliminaron todas correctamente.",
      });
    } catch {
      push({
        type: "error",
        title: "Error",
        message: "No se pudieron eliminar todas las notificaciones.",
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    notifications,
    loading,
    loadNotifications,
    markAsRead,
    removeNotification,
    removeAll,
  };
}