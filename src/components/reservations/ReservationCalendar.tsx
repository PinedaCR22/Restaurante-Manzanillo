// components/reservations/ReservationCalendar.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import type { TimeSlot } from '../../types/reservation';
import { useReservation } from '../../sections/homepage/reservationpage';


const ReservationCalendar: React.FC = () => {
  const { reservationData, updateReservationData, nextStep } = useReservation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(reservationData.date);
  const [selectedTime, setSelectedTime] = useState<string>(reservationData.time);
  const [guests, setGuests] = useState<number>(reservationData.guests);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Generar slots de tiempo disponibles
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const isToday = date.toDateString() === new Date().toDateString();
    const currentHour = new Date().getHours();
    
    // Horarios de almuerzo: 12:00 - 15:00
    const lunchSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];
    // Horarios de cena: 19:00 - 22:30
    const dinnerSlots = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
    
    [...lunchSlots, ...dinnerSlots].forEach((time, index) => {
      const [hours] = time.split(':').map(Number);
      const isAvailable = !isToday || hours > currentHour;
      
      slots.push({
        id: `slot-${index}`,
        time,
        available: isAvailable && Math.random() > 0.3 // Simulamos disponibilidad
      });
    });
    
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior para completar la primera semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Días del siguiente mes para completar la última semana
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateReservationData({
        date: selectedDate,
        time: selectedTime,
        guests: guests
      });
      nextStep();
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona Fecha y Hora</h2>
        <p className="text-gray-600">Disfruta de una experiencia gastronómica única en nuestro restaurante</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day.isCurrentMonth && !isDateDisabled(day.date) && handleDateSelect(day.date)}
                disabled={!day.isCurrentMonth || isDateDisabled(day.date)}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200
                  ${!day.isCurrentMonth 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : isDateDisabled(day.date)
                      ? 'text-gray-300 cursor-not-allowed'
                      : selectedDate?.toDateString() === day.date.toDateString()
                        ? 'bg-red-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>

        {/* Time and Details Section */}
        <div>
          {/* Guest Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Número de comensales
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'persona' : 'personas'}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-1" />
                Horarios disponibles
              </label>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Almuerzo</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.filter(slot => {
                      const hour = parseInt(slot.time.split(':')[0]);
                      return hour >= 12 && hour < 16;
                    }).map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          p-2 text-sm rounded-lg border transition-all duration-200
                          ${!slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : selectedTime === slot.time
                              ? 'bg-red-500 text-white border-red-500 shadow-md'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-600'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Cena</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.filter(slot => {
                      const hour = parseInt(slot.time.split(':')[0]);
                      return hour >= 19;
                    }).map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          p-2 text-sm rounded-lg border transition-all duration-200
                          ${!slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                            : selectedTime === slot.time
                              ? 'bg-red-500 text-white border-red-500 shadow-md'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-600'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
              ${selectedDate && selectedTime
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;