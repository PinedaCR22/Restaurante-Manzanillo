import type { RestaurantReservation } from "../../../types/restaurant-reservations/RestaurantReservation";
import { Phone, Mail, Users, Calendar, Clock } from "lucide-react";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useState } from "react";

interface Props {
  reservation: RestaurantReservation;
  onChangeStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export function ReservationCard({ reservation, onChangeStatus, onDelete }: Props) {
  const { id, customerName, note, phone, email, peopleCount, date, time, status } = reservation;
  const [showConfirm, setShowConfirm] = useState(false);

  // 🎨 Colores según estado
  const color =
    status === "confirmed"
      ? "text-green-700 bg-green-100"
      : status === "cancelled"
      ? "text-red-700 bg-red-100"
      : "text-yellow-700 bg-yellow-100";

  // 🎯 Etiqueta legible
  const label =
    status === "confirmed"
      ? "Confirmada"
      : status === "cancelled"
      ? "Cancelada"
      : "Pendiente";

  return (
    <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* 🧾 Información general */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{customerName}</h3>

          <div className="mt-1 text-sm text-gray-600 space-y-0.5">
            <p className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-500" />
              {date}
            </p>
            <p className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-500" />
              {time}
            </p>
            <p className="flex items-center gap-1.5">
              <Users size={14} className="text-gray-500" />
              {peopleCount} {peopleCount === 1 ? "persona" : "personas"}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-500" />
              {phone}
            </p>
            <p className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-500" />
              {email}
            </p>
          </div>

          <p className={`inline-block mt-3 text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
            {label.toUpperCase()}
          </p>

          {note && <p className="text-sm mt-2 text-gray-500 italic">{note}</p>}
        </div>

        {/* 🎛️ Botones de acción */}
        <div className="flex flex-wrap sm:flex-col gap-2 self-center sm:self-start">
          {status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onChangeStatus(id, "confirmed")}
              >
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onChangeStatus(id, "cancelled")}
              >
                Cancelar
              </Button>
            </>
          )}

          {status === "confirmed" && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onChangeStatus(id, "cancelled")}
            >
              Cancelar
            </Button>
          )}

          {status === "cancelled" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onChangeStatus(id, "pending")}
            >
              Reabrir
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowConfirm(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={showConfirm}
        message={`¿Deseas eliminar la reserva de ${customerName}?`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          onDelete(id);
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
