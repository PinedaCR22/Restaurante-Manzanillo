import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ToastViewport from "../../components/ui/ToastViewport";
import ModalBase from "../../components/ui/ModalBase";
import { RotateCcw, Filter, Trash2, ExternalLink, Bell } from "lucide-react";
import { useNotifications } from "../../hooks/notifications/useNotifications";
import type { Notification } from "../../types/notifications/notification";
import NotificationCard from "../../components/notifications/NotificationCard";

type FilterType = "all" | "new" | "read";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    loadNotifications,
    markAsRead,
    removeNotification,
    removeAll,
  } = useNotifications();

  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  const itemsPerPage = 5;

  // ✅ Ya no necesitamos deduplicar aquí porque useNotifications ya lo hace
  // Las notificaciones vienen limpias desde el hook

  // 🔍 Filtrar según el estado
  const filtered = notifications.filter((n) =>
    filter === "all" ? true : n.status === filter
  );

  // 📄 Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  /** 🔗 Redirección contextual según tipo */
  const handleView = (n: Notification) => {
    if (n.category === "RESERVATION" && n.restaurantReservation)
      navigate(`/admin/reservas/${n.restaurantReservation.id}`);
    else if (n.category === "ACTIVITY") navigate("/admin/actividades");
    else setSelected(n);
  };

  /** Estado de carga */
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-gray-600">
        <Bell className="w-6 h-6 mb-2 animate-pulse text-[#0D784A]" />
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastViewport />

      {/* Confirmaciones */}
      <ConfirmDialog
        open={!!confirmDelete}
        message="¿Deseas eliminar esta notificación?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete !== null) {
            await removeNotification(confirmDelete);
            setConfirmDelete(null);
          }
        }}
      />
      <ConfirmDialog
        open={confirmDeleteAll}
        message="¿Eliminar todas las notificaciones?"
        onCancel={() => setConfirmDeleteAll(false)}
        onConfirm={async () => {
          await removeAll();
          setConfirmDeleteAll(false);
        }}
      />

      {/* Modal de detalle */}
      <ModalBase
        open={!!selected}
        title={selected?.title ?? ""}
        onClose={() => setSelected(null)}
      >
        <p className="text-gray-700 text-sm leading-relaxed">
          {selected?.message}
        </p>
        <div className="mt-3 text-xs text-gray-500">
          {selected && new Date(selected.createdAt).toLocaleString("es-CR")}
        </div>
        {selected?.category === "RESERVATION" &&
          selected?.restaurantReservation && (
            <a
              href={`/admin/reservas/${selected.restaurantReservation.id}`}
              className="inline-flex items-center text-[#0D784A] text-sm font-medium mt-3 hover:underline"
            >
              Ver reserva <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
      </ModalBase>

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#0D784A] flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#0D784A]" /> Notificaciones
        </h1>

        <div className="flex items-center gap-2">
          {/* Filtro */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="border border-gray-300 rounded-xl text-sm px-3 py-2 text-gray-700 focus:ring-[#0D784A] focus:border-[#0D784A] pr-8 bg-white shadow-sm"
            >
              <option value="all">Todas</option>
              <option value="new">Nuevas</option>
              <option value="read">Leídas</option>
            </select>
            <Filter className="absolute right-2.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Recargar */}
          <button
            onClick={loadNotifications}
            className="p-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-[#0D784A] shadow-sm transition"
            title="Actualizar lista"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Eliminar todas */}
          {notifications.length > 0 && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="p-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 shadow-sm transition"
              title="Eliminar todas las notificaciones"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Listado */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <Bell className="w-10 h-10 mb-3 text-gray-400" />
          <p>No hay notificaciones para mostrar.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {current.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onView={() => handleView(n)}
                onMarkRead={() => markAsRead(n.id)}
                onDelete={() => setConfirmDelete(n.id)}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}