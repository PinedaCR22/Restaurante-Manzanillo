import { Mail, Calendar, Bell, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import type { FC } from "react";
import type { Notification } from "../../types/notifications/notification";

type Props = {
  notification: Notification;
  onMarkRead: () => void;
  onDelete: () => void;
  onView: () => void;
};

/**
 * Tarjeta individual de notificación
 * Muestra detalles al hacer clic en modal
 */
const NotificationCard: FC<Props> = ({
  notification,
  onMarkRead,
  onDelete,
  onView,
}) => {
  const { 
    title, 
    message, 
    status, 
    createdAt, 
    category, 
    restaurantReservation, 
    activityContactForm 
  } = notification;

  const upperCategory = category?.toUpperCase();
  const isActivity = upperCategory === "ACTIVITY";
  const isReservation =
    upperCategory === "RESERVATION" ||
    upperCategory === "RESERVA" ||
    upperCategory === "BOOKING";

  // 🎯 Manejo de clic - solo abre modal
  const handleCardClick = () => {
    // Marcar como leída automáticamente al hacer clic
    if (status !== "read") {
      onMarkRead();
    }
    // Mostrar modal con detalles
    onView();
  };

  const icon = isActivity ? (
    <Mail className="w-5 h-5 text-green-600" />
  ) : isReservation ? (
    <Calendar className="w-5 h-5 text-blue-600" />
  ) : (
    <Bell className="w-5 h-5 text-gray-500" />
  );

  const label = isActivity
    ? "Formulario de contacto"
    : isReservation
    ? "Reserva"
    : "Sistema";

  const labelColor = isActivity
    ? "bg-green-100 text-green-700"
    : isReservation
    ? "bg-blue-100 text-blue-700"
    : "bg-gray-100 text-gray-600";

  return (
    <div
      className={`flex items-center justify-between border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-150 cursor-pointer ${
        status === "read" ? "opacity-80" : "opacity-100"
      }`}
    >
      {/* Contenido clickable */}
      <div
        className="flex-1"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      >
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h3
            className={`font-semibold text-base ${
              status === "read" ? "text-gray-600" : "text-[#0D784A]"
            }`}
          >
            {title}
          </h3>
        </div>

        <p className="text-sm text-gray-700 mt-1 line-clamp-2">{message}</p>

        {/* Detalles adicionales según tipo */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-medium ${labelColor}`}
          >
            {label}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleString("es-CR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          
          {/* 📋 Info extra de reserva */}
          {isReservation && restaurantReservation && (
            <>
              {restaurantReservation.customerName && (
                <span className="text-xs text-blue-600 font-medium">
                  👤 {restaurantReservation.customerName}
                </span>
              )}
              {restaurantReservation.date && (
                <span className="text-xs text-blue-600">
                  📅 {restaurantReservation.date}
                </span>
              )}
              {restaurantReservation.peopleCount && (
                <span className="text-xs text-blue-600">
                  👥 {restaurantReservation.peopleCount} {restaurantReservation.peopleCount === 1 ? 'persona' : 'personas'}
                </span>
              )}
            </>
          )}

          {/* ✉️ Info extra de actividad/contacto */}
          {isActivity && activityContactForm && (
            <>
              {activityContactForm.name && (
                <span className="text-xs text-green-600 font-medium">
                  👤 {activityContactForm.name}
                </span>
              )}
              {activityContactForm.email && (
                <span className="text-xs text-green-600">
                  ✉️ {activityContactForm.email}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
        {status !== "read" && (
          <Button
            variant="secondary"
            size="sm"
            className="px-3 py-1 rounded-lg text-sm whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
          >
            Marcar leída
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          className="px-3 py-1 rounded-lg text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Eliminar
        </Button>
      </div>

      <ChevronRight className="ml-3 text-gray-400 w-4 h-4 shrink-0" />
    </div>
  );
};

export default NotificationCard;