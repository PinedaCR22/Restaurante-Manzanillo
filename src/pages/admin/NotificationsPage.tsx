import { useState } from "react";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ToastViewport from "../../components/ui/ToastViewport";
import ModalBase from "../../components/ui/ModalBase";
import { RotateCcw, Filter, Trash2, Bell, Mail, Calendar } from "lucide-react";
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

  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  const itemsPerPage = 5;

  // 🔍 Filtrar según el estado
  const filtered = notifications.filter((n) =>
    filter === "all" ? true : n.status === filter
  );

  // 📄 Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  /** 🔍 Mostrar detalles en modal (sin redirección) */
  const handleView = (n: Notification) => {
    // Marcar como leída al ver
    if (n.status !== "read") {
      markAsRead(n.id);
    }
    // Mostrar modal con detalles completos
    setSelected(n);
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

      {/* Modal de detalle mejorado */}
      <ModalBase
        open={!!selected}
        title={selected?.title ?? ""}
        onClose={() => setSelected(null)}
      >
        <div className="space-y-4">
          {/* Mensaje principal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {selected?.message}
            </p>
          </div>

          {/* Detalles de RESERVA */}
          {selected?.category === "RESERVATION" && selected?.restaurantReservation && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Detalles de la Reserva
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.restaurantReservation.customerName && (
                  <div>
                    <span className="text-gray-500">Cliente:</span>
                    <p className="font-medium text-gray-900">
                      {selected.restaurantReservation.customerName}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.date && (
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <p className="font-medium text-gray-900">
                      {selected.restaurantReservation.date}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.time && (
                  <div>
                    <span className="text-gray-500">Hora:</span>
                    <p className="font-medium text-gray-900">
                      {selected.restaurantReservation.time}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.peopleCount && (
                  <div>
                    <span className="text-gray-500">Personas:</span>
                    <p className="font-medium text-gray-900">
                      {selected.restaurantReservation.peopleCount} {selected.restaurantReservation.peopleCount === 1 ? 'persona' : 'personas'}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.phone && (
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium text-gray-900">
                      {selected.restaurantReservation.phone}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.email && (
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-gray-900 truncate">
                      {selected.restaurantReservation.email}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.zone && (
                  <div>
                    <span className="text-gray-500">Zona:</span>
                    <p className="font-medium text-[#0D784A]">
                      {selected.restaurantReservation.zone}
                    </p>
                  </div>
                )}
                {selected.restaurantReservation.tableNumber && (
                  <div>
                    <span className="text-gray-500">Mesa:</span>
                    <p className="font-medium text-[#0D784A]">
                      #{selected.restaurantReservation.tableNumber}
                    </p>
                  </div>
                )}
              </div>
              {selected.restaurantReservation.note && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 font-medium">Notas:</span>
                  <p className="text-sm text-gray-700 mt-1 italic leading-relaxed">
                    {selected.restaurantReservation.note}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Detalles de ACTIVIDAD/CONTACTO */}
          {selected?.category === "ACTIVITY" && selected.activityContactForm && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                Detalles del Contacto
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.activityContactForm.name && (
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <p className="font-medium text-gray-900">
                      {selected.activityContactForm.name}
                    </p>
                  </div>
                )}
                {selected.activityContactForm.email && (
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium text-gray-900 truncate">
                      {selected.activityContactForm.email}
                    </p>
                  </div>
                )}
                {selected.activityContactForm.phone && (
                  <div>
                    <span className="text-gray-500">Teléfono:</span>
                    <p className="font-medium text-gray-900">
                      {selected.activityContactForm.phone}
                    </p>
                  </div>
                )}
                {selected.activityContactForm.activityName && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Actividad:</span>
                    <p className="font-medium text-[#0D784A]">
                      {selected.activityContactForm.activityName}
                    </p>
                  </div>
                )}
              </div>
              {selected.activityContactForm.message && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 font-medium">Mensaje:</span>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {selected.activityContactForm.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fecha de la notificación */}
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-500">
              Recibida: {selected && new Date(selected.createdAt).toLocaleString("es-CR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
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