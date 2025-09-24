import React from "react";
import { CheckCircle, Calendar, MapPin, User, FileCheck, Sparkles } from "lucide-react";
import ReservationCalendar from "../../components/reservations/ReservationCalendar";
import ReservationForm from "../../components/reservations/ReservationForm";
import ReservationMap from "../../components/reservations/ReservationMap";
import type { ReservationStep } from "../../types/reservation";
import { ReservationProvider, useReservation } from "./reservationpage";


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
      ? new Intl.DateTimeFormat("es-CR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(
          date
        )
      : "";

  if (isConfirmed) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-[#50ABD7] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600">Tu mesa ha sido reservada exitosamente</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-[#50ABD7] mb-3">Detalles de tu reserva:</h3>
          <div className="space-y-2 text-blue-700">
            <p><strong>Fecha:</strong> {formatDate(reservationData.date)}</p>
            <p><strong>Hora:</strong> {reservationData.time}</p>
            <p><strong>Mesa:</strong> #{reservationData.tableId}</p>
            <p><strong>Comensales:</strong> {reservationData.guests}</p>
            <p><strong>Nombre:</strong> {reservationData.customerInfo.fullName}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Recibirás un email de confirmación en {reservationData.customerInfo.email}
        </p>

        <button
          onClick={resetReservation}
          className="bg-[#50ABD7] text-white px-6 py-3 rounded-lg hover:bg-[#3f98c1] transition-colors"
        >
          Nueva Reserva
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar Reserva</h2>
        <p className="text-gray-600">Revisa todos los detalles antes de confirmar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#50ABD7]" />
              Fecha y Hora
            </h3>
            <p className="text-gray-600">{formatDate(reservationData.date)}</p>
            <p className="font-medium text-[#50ABD7]">{reservationData.time}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#50ABD7]" />
              Mesa
            </h3>
            <p className="text-gray-600">Mesa #{reservationData.tableId}</p>
            <p className="text-sm text-gray-500">{reservationData.guests} comensales</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#50ABD7]" />
              Información de Contacto
            </h3>
            <p className="text-gray-600">{reservationData.customerInfo.fullName}</p>
            <p className="text-gray-600">{reservationData.customerInfo.email}</p>
            <p className="text-gray-600">{reservationData.customerInfo.phone}</p>
          </div>

          {reservationData.customerInfo.specialRequests && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Peticiones Especiales</h3>
              <p className="text-gray-600">{reservationData.customerInfo.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => window.history.back()}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Modificar
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#50ABD7] text-white hover:bg-[#3f98c1] shadow-md hover:shadow-lg"
          }`}
        >
          {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
};

/* ----------------- Barra de pasos (in-file) ----------------- */
const ProgressSteps: React.FC = () => {
  const { steps } = useReservation();
  const filteredSteps = steps.filter((s: ReservationStep) => s.step <= 4);
  const stepIcons = [Calendar, MapPin, User, FileCheck];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        {filteredSteps.map((step: ReservationStep, index: number) => {
          const Icon = stepIcons[index];
          return (
            <div key={step.step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  step.completed
                    ? "border-[#FBB517] bg-white text-[#50ABD7]"
                    : step.active
                    ? "bg-[#FBB517] border-[#FBB517] text-gray-900"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {step.completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  step.active ? "text-[#FBB517]" : step.completed ? "text-[#50ABD7]" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
              {index < filteredSteps.length - 1 && (
                <div
                  className={`ml-4 w-12 h-0.5 transition-colors duration-200 ${
                    step.completed ? "bg-[#FBB517]" : "bg-gray-300"
                  }`}
                />
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-3 text-[#50ABD7]" />
            Reserva tu Mesa
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reserva tu mesa en línea y disfruta de una experiencia gastronómica única en nuestro restaurante
          </p>
        </div>

        <ProgressSteps />
        {renderCurrentStep()}
      </div>
    </div>
  );
};

const ReservationPage: React.FC = () => (
  <ReservationProvider>
    <ReservationContent />
  </ReservationProvider>
);

export default ReservationPage;
