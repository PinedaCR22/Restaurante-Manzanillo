import { useState } from "react";
import { useRestaurantReservations } from "../../hooks/restaurant-reservations/useRestaurantReservations";
import { ReservationCard } from "../../components/admin/restaurant-reservations/ReservationCard";
import { ReservationSummaryCards } from "../../components/admin/restaurant-reservations/ReservationSummaryCards";
import CreateReservaModal from "../../components/admin/restaurant-reservations/CreateReservaModal";
import type { ReservaFormData } from "../../components/admin/restaurant-reservations/CreateReservaModal";
import Button from "../../components/ui/Button";
import { restaurantReservationService } from "../../services/restaurant-reservations/restaurantReservation.service";
import type { RestaurantReservation } from "../../types/restaurant-reservations/RestaurantReservation";
import { notificationsService } from "../../services/notifications/notifications.service";

export default function RestaurantReservationsPage() {
  const {
    reservations,
    loading,
    error,
    changeStatus,
    deleteReservation,
    refetch,
  } = useRestaurantReservations();

  const adminId = 2; // ⚠️ cambiar luego por usuario logueado

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Guarda reserva en backend con tipado correcto
  const handleCreateReserva = async (data: ReservaFormData) => {
    try {
      setSaving(true);

      console.log("📤 Enviando reserva al backend:", data);

      // ✅ Aseguramos tipos compatibles con RestaurantReservation
      const payload: Partial<RestaurantReservation> = {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        peopleCount: data.peopleCount,
        date: data.date, // ✅ Ya viene en formato YYYY-MM-DD del input date
        time: data.time,
        note: data.note,
        zone: data.zone,
        tableNumber: data.tableNumber,
        status: "pending" as const,
      };

      console.log("📤 Payload formateado:", payload);

      // 🟢 Crear reserva en backend
      const created = await restaurantReservationService.create(payload);
      console.log("✅ Reserva guardada en backend:", created);

      // 📨 Crear notificación (solo agregado, no cambia nada de tu lógica)
      try {
        await notificationsService.create({
          category: "RESERVATION",
          title: "Nueva reserva creada desde panel",
          message: `Reserva creada por ${data.customerName} para el ${data.date} a las ${data.time} en ${data.zone}.`,
          type: "EMAIL",
          restaurant_reservation_id: created.id,
          user_id: adminId,
          reservation_url: `https://admin.mudecoop.cr/reservas/${created.id}`,
        });
        console.log("📧 Notificación enviada correctamente (push + email)");
      } catch (notifyErr) {
        console.error("⚠️ Error al enviar notificación:", notifyErr);
      }

      alert("Reserva creada correctamente ✅");

      // 🔄 Actualizamos lista local
      await refetch();

      setShowModal(false);
    } catch (err) {
      console.error("❌ Error al guardar reserva:", err);
      
      // Mostrar mensaje de error más específico
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("Error al guardar la reserva. Revisa la consola.");
      }
    } finally {
      setSaving(false);
    }
  };

  const summary = {
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  if (loading)
    return <p className="text-center py-6 text-gray-700">Cargando reservas...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D784A]">
          Reservas del Restaurante
        </h1>
        <Button onClick={() => setShowModal(true)} disabled={saving}>
          {saving ? "Guardando..." : "+ Nueva Reserva"}
        </Button>
      </div>

      <ReservationSummaryCards summary={summary} />

      <div className="space-y-4">
        {reservations.map((res) => (
          <ReservationCard
            key={res.id}
            reservation={res}
            onChangeStatus={(id, status) => changeStatus(id, status, adminId)}
            onDelete={deleteReservation}
          />
        ))}
      </div>

      {/* Modal de creación */}
      <CreateReservaModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateReserva}
      />
    </section>
  );
}