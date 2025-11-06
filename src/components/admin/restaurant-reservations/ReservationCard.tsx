import type { RestaurantReservation } from "../../../types/restaurant-reservations/RestaurantReservation";
import { Phone, Mail, Users, Calendar, Clock, MapPin, Hash } from "lucide-react";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useState } from "react";

interface Props {
  reservation: RestaurantReservation;
  onChangeStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export function ReservationCard({ reservation, onChangeStatus, onDelete }: Props) {
  const { 
    id, 
    customerName, 
    note, 
    phone, 
    email, 
    peopleCount, 
    date, 
    time, 
    status,
    zone,
    tableNumber 
  } = reservation;
  
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
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* 🧾 Información general */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-800">{customerName}</h3>
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${color}`}>
              {label.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-sm text-gray-600">
            {/* Columna 1: Fecha, Hora, Personas */}
            <div className="space-y-1.5">
              <p className="flex items-center gap-2">
                <Calendar size={15} className="text-gray-500 flex-shrink-0" />
                <span className="font-medium">Fecha:</span>
                <span>{date}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={15} className="text-gray-500 flex-shrink-0" />
                <span className="font-medium">Hora:</span>
                <span>{time}</span>
              </p>
              <p className="flex items-center gap-2">
                <Users size={15} className="text-gray-500 flex-shrink-0" />
                <span className="font-medium">Personas:</span>
                <span>{peopleCount} {peopleCount === 1 ? "persona" : "personas"}</span>
              </p>
            </div>

            {/* Columna 2: Contacto, Zona, Mesa */}
            <div className="space-y-1.5">
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-gray-500 flex-shrink-0" />
                <span className="font-medium">Teléfono:</span>
                <span>{phone}</span>
              </p>
              {email && (
                <p className="flex items-center gap-2">
                  <Mail size={15} className="text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{email}</span>
                </p>
              )}
              {zone && (
                <p className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#0D784A] flex-shrink-0" />
                  <span className="font-medium">Zona:</span>
                  <span className="text-[#0D784A] font-medium">{zone}</span>
                </p>
              )}
              {tableNumber && (
                <p className="flex items-center gap-2">
                  <Hash size={15} className="text-[#0D784A] flex-shrink-0" />
                  <span className="font-medium">Mesa:</span>
                  <span className="text-[#0D784A] font-semibold">#{tableNumber}</span>
                </p>
              )}
            </div>
          </div>

          {note && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Notas:</span>{" "}
                <span className="italic">{note}</span>
              </p>
            </div>
          )}
        </div>

        {/* 🎛️ Botones de acción */}
        <div className="flex flex-wrap lg:flex-col gap-2 self-start lg:self-start">
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