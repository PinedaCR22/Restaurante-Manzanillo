// src/sections/homepage/reservationpage.tsx
import React from "react";
import { ReservationProvider } from "../../hooks/public/reservation.provider";
import { useReservation } from "../../hooks/public/useReservation";

import ReservationCalendar from "../../components/reservations/ReservationCalendar";
import ReservationMap from "../../components/reservations/ReservationMap";
import ReservationForm from "../../components/reservations/ReservationForm";

const Steps = () => {
  const { currentStep } = useReservation();

  return (
    <>
      {currentStep === 1 && <ReservationCalendar />}
      {currentStep === 2 && <ReservationMap />}
      {currentStep === 3 && <ReservationForm />}
      {currentStep === 4 && (
        <div className="text-center p-10">
          <h2 className="text-3xl font-bold">✅ ¡Reserva completada!</h2>
          <p>Te llegará un correo de confirmación.</p>
        </div>
      )}
    </>
  );
};

export default function ReservationPage() {
  return (
    <ReservationProvider>
      <Steps />
    </ReservationProvider>
  );
}
