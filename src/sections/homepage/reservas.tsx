// src/sections/homepage/reservas.tsx
import React from "react";
import { CheckCircle, Calendar, MapPin, User, FileCheck, Utensils } from "lucide-react";
import ReservationCalendar from "../../components/reservations/ReservationCalendar";
import ReservationForm from "../../components/reservations/ReservationForm";
import ReservationMap from "../../components/reservations/ReservationMap";
import type { ReservationStep } from "../../types/reservation";
import { ReservationProvider, useReservation } from "./reservationpage";

/* ============================== */
/*  Config de estilos de marca    */
/* ============================== */
const BROWN = "#443314";

/* ----------------- Confirmación ----------------- */
const ReservationConfirmation: React.FC = () => {
  const { reservationData, submitReservation, resetReservation } = useReservation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await submitReservation();
    setIsConfirmed(true);
    setIsSubmitting(false);
  };

  const formatDate = (date: Date | null): string =>
    date
      ? new Intl.DateTimeFormat("es-CR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date)
      : "";

  if (isConfirmed) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: BROWN }} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600">Tu mesa ha sido reservada exitosamente</p>
        </div>

        <div className="rounded-lg p-6 mb-6" style={{ background: "#f9f6f3" }}>
          <h3 className="font-semibold mb-3" style={{ color: BROWN }}>
            Detalles de tu reserva:
          </h3>
          <div className="space-y-2" style={{ color: BROWN }}>
            <p>
              <strong>Fecha:</strong> {formatDate(reservationData.date)}
            </p>
            <p>
              <strong>Hora:</strong> {reservationData.time}
            </p>
            <p>
              <strong>Mesa:</strong> #{reservationData.tableId}
            </p>
            <p>
              <strong>Comensales:</strong> {reservationData.guests}
            </p>
            <p>
              <strong>Nombre:</strong> {reservationData.customerInfo.fullName}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Recibirás un email de confirmación en {reservationData.customerInfo.email}
        </p>

        <button
          onClick={resetReservation}
          className="px-6 py-3 rounded-lg text-white transition-colors"
          style={{ backgroundColor: BROWN }}
        >
          Nueva Reserva
        </button>
      </div>
    );
  }

  // Vista de confirmación (previa al envío)
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar Reserva</h2>
        <p className="text-gray-600">Revisa todos los detalles antes de confirmar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" style={{ color: BROWN }} />
            Fecha y Hora
          </h3>
          <p className="text-gray-600">{formatDate(reservationData.date)}</p>
          <p className="font-medium" style={{ color: BROWN }}>
            {reservationData.time}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" style={{ color: BROWN }} />
            Mesa
          </h3>
          <p className="text-gray-600">Mesa #{reservationData.tableId}</p>
          <p className="text-sm text-gray-500">{reservationData.guests} comensales</p>
        </div>
      </div>

      <div className="rounded-lg border p-4 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2" style={{ color: BROWN }} />
          Información de Contacto
        </h3>
        <p className="text-gray-600">{reservationData.customerInfo.fullName}</p>
        <p className="text-gray-600">{reservationData.customerInfo.email}</p>
        <p className="text-gray-600">{reservationData.customerInfo.phone}</p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Modificar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "text-white"
          }`}
          style={!isSubmitting ? { backgroundColor: BROWN } : undefined}
        >
          {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
};

/* ----------------- Barra de pasos ----------------- */
const ProgressSteps: React.FC = () => {
  const { steps } = useReservation();
  const filteredSteps = steps.filter((s: ReservationStep) => s.step <= 4);
  const stepIcons = [Calendar, MapPin, User, FileCheck];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        {filteredSteps.map((step: ReservationStep, index: number) => {
          const Icon = stepIcons[index];
          const activeOrDone = step.active || step.completed;
          return (
            <div key={step.step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  activeOrDone ? "text-white" : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
                style={activeOrDone ? { backgroundColor: BROWN, borderColor: BROWN } : undefined}
              >
                {step.completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${activeOrDone ? "text-[color:var(--brown)]" : "text-gray-400"}`}
                style={{ ["--brown" as any]: BROWN }}
              >
                {step.title}
              </span>
              {index < filteredSteps.length - 1 && (
                <div className="ml-4 w-12 h-0.5" style={{ backgroundColor: BROWN }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ----------------- Contenido principal ----------------- */
const ReservationContent: React.FC = () => {
  const { currentStep } = useReservation();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ReservationCalendar />;
      case 2:
        return <ReservationMap />;
      case 3:
        return <ReservationForm />;
      case 4:
        return <ReservationConfirmation />;
      default:
        return <ReservationCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Título igual al de pages/menu.tsx + degradado */}
        <div className="px-3 md:px-6 text-center mb-8">
          <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-4">
            <h2 className="flex items-center justify-center text-xl md:text-2xl font-extrabold tracking-wide text-stone-800">
              <Utensils className="w-7 h-7 mr-2" style={{ color: BROWN }} />
              ¡RESERVA TU MESA!
            </h2>
            <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
          </div>
        </div>

        <ProgressSteps />
        {renderCurrentStep()}
      </div>
    </div>
  );
};

/* ----------------- Página principal ----------------- */
const ReservationPage: React.FC = () => (
  <ReservationProvider>
    <ReservationContent />
  </ReservationProvider>
);

export default ReservationPage;
