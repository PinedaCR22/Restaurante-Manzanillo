// components/reservations/ReservationForm.tsx
import React, { useState } from "react";
import { User, Mail, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { useReservation } from "../../sections/homepage/reservationpage";


/** Brand colors */
const BLUE = "#50ABD7";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const ReservationForm: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } =
    useReservation();

  const [formData, setFormData] = useState({
    fullName: reservationData.customerInfo.fullName,
    email: reservationData.customerInfo.email,
    phone: reservationData.customerInfo.phone,
    specialRequests: reservationData.customerInfo.specialRequests,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  /** Validadores básicos */
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string): boolean =>
    /^[\+]?[0-9\s\-\(\)]{8,}$/.test(phone);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = "Por favor ingresa un teléfono válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    if (validateForm()) {
      updateReservationData({
        customerInfo: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          specialRequests: formData.specialRequests.trim(),
        },
      });
      nextStep();
    }

    setIsValidating(false);
  };

  const handleBack = () => {
    updateReservationData({
      customerInfo: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        specialRequests: formData.specialRequests.trim(),
      },
    });
    prevStep();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getInputClassName = (field: keyof FormErrors) => {
    const base =
      "w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2";
    const error = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normal = `border-gray-300 focus:ring-[${BLUE}] focus:border-[${BLUE}]`;
    return `${base} ${errors[field] ? error : normal}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Información de Contacto
        </h2>
        <p className="text-gray-600">Completa tus datos para confirmar</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Resumen */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Resumen de Reserva
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium" style={{ color: BLUE }}>
                {formatDate(reservationData.date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hora:</span>
              <span
                className="font-medium text-white px-2 py-1 rounded text-sm"
                style={{ background: BLUE }}
              >
                {reservationData.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comensales:</span>
              <span
                className="font-medium px-2 py-1 rounded text-sm"
                style={{ background: "#EFF6FF", color: BLUE }}
              >
                {reservationData.guests}{" "}
                {reservationData.guests === 1 ? "persona" : "personas"}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• La mesa se mantendrá por 15 minutos</li>
                  <li>• Recibirás confirmación por email</li>
                  <li>• Para cambios contactar al restaurante</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="inline w-4 h-4 mr-1" />
                Nombre completo *
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Tu nombre completo"
                className={getInputClassName("fullName")}
                aria-invalid={!!errors.fullName}
                aria-describedby="error-fullName"
                autoComplete="name"
                maxLength={80}
              />
              {errors.fullName && (
                <p
                  id="error-fullName"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Mail className="inline w-4 h-4 mr-1" />
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="tu@email.com"
                className={getInputClassName("email")}
                aria-invalid={!!errors.email}
                aria-describedby="error-email"
                autoComplete="email"
                maxLength={254}
              />
              {errors.email && (
                <p
                  id="error-email"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="inline w-4 h-4 mr-1" />
                Teléfono *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+506 8888-8888"
                className={getInputClassName("phone")}
                aria-invalid={!!errors.phone}
                aria-describedby="error-phone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
              />
              {errors.phone && (
                <p
                  id="error-phone"
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Peticiones */}
            <div>
              <label
                htmlFor="specialRequests"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Peticiones especiales
              </label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                placeholder="Alergias, celebraciones, preferencias de mesa..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--blue)] focus:border-[color:var(--blue)] resize-none transition-all duration-200"
                style={
                  {
                    "--blue": BLUE,
                  } as React.CSSProperties
                }
                maxLength={300}
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional - máx. 300 caracteres
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isValidating}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isValidating
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "text-white shadow-md hover:shadow-lg"
                }`}
                style={
                  !isValidating ? { backgroundColor: BLUE } : undefined
                }
              >
                {isValidating ? "Validando..." : "Continuar"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            * Campos obligatorios. Recibirás confirmación por email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
