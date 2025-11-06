// src/components/reservations/ReservationForm.tsx
import React, { useState } from "react";
import { useReservation } from "../../hooks/public/useReservation";

const BLUE = "#50ABD7";

const ReservationForm: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } =
    useReservation();

  const [form, setForm] = useState(reservationData.customerInfo);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleContinue = () => {
    updateReservationData({ customerInfo: form });
    nextStep();
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 max-w-3xl mx-auto text-app border">
      <h2 className="text-2xl font-bold mb-4">Datos de Contacto</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre completo</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full p-3 border rounded-lg bg-app"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Correo electrónico</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 border rounded-lg bg-app"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Teléfono</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-3 border rounded-lg bg-app"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Notas</label>
          <textarea
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            className="w-full p-3 border rounded-lg bg-app"
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-4 border rounded-lg"
        >
          Volver
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 py-3 px-4 rounded-lg text-white shadow-md"
          style={{ backgroundColor: BLUE }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ReservationForm;
