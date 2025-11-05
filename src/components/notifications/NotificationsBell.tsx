import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { notificationsService } from "../../services/notifications/notifications.service";
import type { Notification } from "../../types/notifications/notification";

/**
 * Función centralizada para eliminar duplicados (misma que useNotifications)
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
 * Campana de notificaciones (responsive + estandarizada)
 */
export function NotificationsBell() {
  const [unread, setUnread] = useState(0);
  const location = useLocation();

  const loadUnread = async () => {
    try {
      const data: Notification[] = await notificationsService.getAll();
      
      // 🧩 Eliminar duplicados usando la misma lógica que useNotifications
      const unique = removeDuplicates(data);
      
      // 🔢 Contar solo las notificaciones "new" únicas
      const count = unique.filter((n) => n.status === "new").length;
      setUnread(count);
    } catch (err) {
      console.warn("⚠️ Error cargando notificaciones:", err);
    }
  };

  useEffect(() => {
    loadUnread();
    const handler = () => loadUnread();
    window.addEventListener("notifications-updated", handler);

    const interval = setInterval(loadUnread, 30000);

    return () => {
      window.removeEventListener("notifications-updated", handler);
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <Link
      to="/admin/notificaciones"
      title="Ver notificaciones"
      className="relative flex items-center justify-center p-2 rounded-xl hover:bg-[#E6F4EE] transition"
    >
      <Bell
        className={`w-6 h-6 transition ${
          unread > 0 ? "text-[#0D784A] animate-pulse" : "text-gray-700"
        }`}
      />
      {unread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
          {unread}
        </span>
      )}
    </Link>
  );
}