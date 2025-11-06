import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "../ui/ModalBase";
import Button from "../ui/Button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react";
import type { Notification } from "../../types/notifications/notification";
import type { RestaurantReservation } from "../../types/restaurant-reservations/RestaurantReservation";
import { restaurantReservationService } from "../../services/restaurant-reservations/restaurantReservation.service";

type Props = {
  notification: Notification | null;
  onClose: () => void;
  onStatusChange?: () => void;
};

/**
 * Modal detallado para mostrar información completa de notificaciones
 * con acciones contextuales según el tipo (RESERVA o CONTACTO)
 */
const NotificationDetailModal: FC<Props> = ({ 
  notification, 
  onClose,
  onStatusChange 
}) => {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<RestaurantReservation | null>(null);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (notification?.category === "RESERVATION" && notification.restaurantReservation?.id) {
      loadReservationDetails(notification.restaurantReservation.id);
    }
  }, [notification]);

  const loadReservationDetails = async (id: number) => {
    try {
      setLoadingReservation(true);
      // Obtener todas las reservas y filtrar por ID
      const allReservations = await restaurantReservationService.getAll();
      const found = allReservations.find(r => r.id === id);
      setReservation(found || null);
    } catch (error) {
      console.error("Error cargando reserva:", error);
    } finally {
      setLoadingReservation(false);
    }
  };

  const handleGoToReservation = () => {
    if (reservation) {
      navigate(`/admin/reservas/${reservation.id}`);
      onClose();
    }
  };

  const handleGoToActivity = () => {
    navigate("/admin/actividades");
    onClose();
  };

  const handleConfirmReservation = async () => {
    if (!reservation) return;
    try {
      setActionLoading(true);
      const userId = 1; // Obtener del contexto de autenticación
      await restaurantReservationService.updateStatus(reservation.id, "confirmed", userId);
      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error("Error confirmando reserva:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;
    try {
      setActionLoading(true);
      const userId = 1; // Obtener del contexto de autenticación
      await restaurantReservationService.updateStatus(reservation.id, "cancelled", userId);
      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error("Error cancelando reserva:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (!notification) return null;

  const isReservation = notification.category === "RESERVATION";
  const isActivity = notification.category === "ACTIVITY";

  return (
    <ModalBase
      open={!!notification}
      title={notification.title}
      onClose={onClose}
      width="800px"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Mensaje principal */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-3">
            {new Date(notification.createdAt).toLocaleString("es-CR", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Detalles de RESERVA */}
        {isReservation && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Calendar className="w-5 h-5 text-[#0D784A]" />
              <h3 className="font-semibold text-[#0D784A]">Detalles de la Reserva</h3>
            </div>

            {loadingReservation ? (
              <div className="text-center py-6 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D784A] mx-auto"></div>
                <p className="mt-2">Cargando detalles...</p>
              </div>
            ) : reservation ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cliente */}
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Cliente</p>
                      <p className="font-medium text-gray-900">{reservation.customerName}</p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString("es-CR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-medium text-gray-900">{reservation.time}</p>
                    </div>
                  </div>

                  {/* Personas */}
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Personas</p>
                      <p className="font-medium text-gray-900">
                        {reservation.peopleCount} {reservation.peopleCount === 1 ? "persona" : "personas"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  {reservation.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Correo</p>
                        <p className="font-medium text-gray-900 break-all">{reservation.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Teléfono */}
                  {reservation.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium text-gray-900">{reservation.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Zona */}
                  {reservation.zone && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Zona</p>
                        <p className="font-medium text-gray-900">{reservation.zone}</p>
                      </div>
                    </div>
                  )}

                  {/* Estado */}
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : reservation.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reservation.status === "confirmed" && <CheckCircle className="w-3 h-3" />}
                        {reservation.status === "cancelled" && <XCircle className="w-3 h-3" />}
                        {reservation.status === "confirmed"
                          ? "Confirmada"
                          : reservation.status === "cancelled"
                          ? "Cancelada"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nota adicional */}
                {reservation.note && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-500 mb-1">Nota del cliente:</p>
                    <p className="text-gray-700">{reservation.note}</p>
                  </div>
                )}

                {/* Acciones para reserva */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleGoToReservation}
                    className="flex items-center gap-2"
                    disabled={actionLoading}
                  >
                    Ver detalles completos
                    <ExternalLink className="w-4 h-4" />
                  </Button>

                  {reservation.status === "pending" && (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleConfirmReservation}
                        className="flex items-center gap-2"
                        disabled={actionLoading}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading ? "Procesando..." : "Confirmar"}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={handleCancelReservation}
                        className="flex items-center gap-2"
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4" />
                        {actionLoading ? "Procesando..." : "Cancelar"}
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No se pudo cargar la información de la reserva</p>
            )}
          </div>
        )}

        {/* Detalles de FORMULARIO DE CONTACTO */}
        {isActivity && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <MessageSquare className="w-5 h-5 text-[#0D784A]" />
              <h3 className="font-semibold text-[#0D784A]">Formulario de Contacto</h3>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700">
                Este mensaje proviene de un formulario de contacto enviado desde la sección de actividades.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={handleGoToActivity}
                className="flex items-center gap-2"
              >
                Ver todos los mensajes
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModalBase>
  );
};

export default NotificationDetailModal;