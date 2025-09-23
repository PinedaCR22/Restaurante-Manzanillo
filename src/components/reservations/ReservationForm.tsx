// components/reservations/ReservationForm.tsx
import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { useReservation } from '../../sections/homepage/reservationpage';


interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const ReservationForm: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } = useReservation();
  
  const [formData, setFormData] = useState({
    fullName: reservationData.customerInfo.fullName,
    email: reservationData.customerInfo.email,
    phone: reservationData.customerInfo.phone,
    specialRequests: reservationData.customerInfo.specialRequests
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Por favor ingresa un teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    if (validateForm()) {
      updateReservationData({
        customerInfo: formData
      });
      nextStep();
    }

    setIsValidating(false);
  };

  const handleBack = () => {
    // Save current form data before going back
    updateReservationData({
      customerInfo: formData
    });
    prevStep();
  };

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getInputClassName = (fieldName: keyof FormErrors) => {
    const baseClasses = "w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2";
    const errorClasses = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normalClasses = "border-gray-300 focus:ring-red-500 focus:border-red-500";
    
    return `${baseClasses} ${errors[fieldName] ? errorClasses : normalClasses}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Información de Contacto</h2>
        <p className="text-gray-600">Completa tus datos para confirmar la reserva</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reservation Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Reserva</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium text-red-600">
                {formatDate(reservationData.date)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hora:</span>
              <span className="font-medium bg-red-500 text-white px-2 py-1 rounded text-sm">
                {reservationData.time}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Comensales:</span>
              <span className="font-medium bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {reservationData.guests} {reservationData.guests === 1 ? 'persona' : 'personas'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• La mesa se mantendrá por 15 minutos desde la hora reservada</li>
                  <li>• Recibirás una confirmación por email</li>
                  <li>• Para cambios o cancelaciones contactar al restaurante</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Nombre completo *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Tu nombre completo"
                className={getInputClassName('fullName')}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@email.com"
                className={getInputClassName('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+506 8888-8888"
                className={getInputClassName('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Peticiones especiales
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Alergias, celebraciones, preferencias de mesa..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">Opcional - Ayúdanos a brindarte una mejor experiencia</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isValidating}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
                  ${isValidating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                  }
                `}
              >
                {isValidating ? 'Validando...' : 'Continuar'}
              </button>
            </div>
          </form>

          {/* Required fields note */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            * Campos obligatorios. Recibirás una confirmación por email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;