import { useEffect, useState } from "react";
import type { RestaurantReservation } from "../../types/restaurant-reservations/RestaurantReservation";
import { restaurantReservationService } from "../../services/restaurant-reservations/restaurantReservation.service";

export function useRestaurantReservations() {
  const [reservations, setReservations] = useState<RestaurantReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      setLoading(true);
      const data = await restaurantReservationService.getAll();
      setReservations(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al cargar las reservas");
      }
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: number, status: string, confirmedBy: number) {
    try {
      const updated = await restaurantReservationService.updateStatus(id, status, confirmedBy);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al cambiar el estado de la reserva");
      }
    }
  }

  async function deleteReservation(id: number) {
    try {
      await restaurantReservationService.remove(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al eliminar la reserva");
      }
    }
  }

  return {
    reservations,
    loading,
    error,
    changeStatus,
    deleteReservation,
    refetch: fetchReservations,
  };
}
