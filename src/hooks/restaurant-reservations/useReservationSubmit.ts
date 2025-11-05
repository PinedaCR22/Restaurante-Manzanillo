import { useState } from "react";
import { restaurantReservationService } from "../../services/restaurant-reservations/restaurantReservation.service";
import type { RestaurantReservation } from "../../types/restaurant-reservations/RestaurantReservation";

interface SubmitResult {
  success: boolean;
  message?: string;
  data?: RestaurantReservation;
}

export function useReservationSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function submitReservation(
    formData: {
      fullName: string;
      email: string;
      phone: string;
      specialRequests: string;
      zone?: string;
      tableNumber?: number;
    },
    reservationData: {
      date: Date | null;
      time: string;
      guests: number;
      zone?: string;
      tableNumber?: number;
    }
  ): Promise<SubmitResult> {
    setLoading(true);
    setError(null);

    try {
      // ✅ Consolidar zona y mesa: elige la que venga en formData o reservationData
      const zone = formData.zone ?? reservationData.zone;
      const tableNumber = formData.tableNumber ?? reservationData.tableNumber;

      const payload: Partial<RestaurantReservation> = {
        customerName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        note: formData.specialRequests.trim(),
        date: reservationData.date
          ? reservationData.date.toISOString().split("T")[0]
          : undefined,
        time: reservationData.time,
        peopleCount: Number(reservationData.guests),
        zone: zone ?? undefined,
        tableNumber:
          tableNumber !== undefined && tableNumber !== null
            ? Number(tableNumber)
            : undefined,
        status: "pending",
      };

      console.log("📤 Enviando reserva:", payload);

      const created = await restaurantReservationService.create(payload);

      const res: SubmitResult = {
        success: true,
        message: "Reserva creada correctamente",
        data: created,
      };

      setResult(res);
      return res;
    } catch (err: unknown) {
      let msg = "Error inesperado al crear la reserva. Inténtalo luego.";
      if (err instanceof Error) msg = err.message;

      console.error("❌ Error creando reserva:", err);
      setError(msg);

      const res: SubmitResult = { success: false, message: msg };
      setResult(res);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { submitReservation, loading, error, result };
}
