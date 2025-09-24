// components/reservations/ReservationCalendar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { useReservation } from "../../sections/homepage/reservationpage";
import type { TimeSlot } from "../../types/reservation";


/** Utils */
const BLUE = "#50ABD7";

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const combineDateTime = (date: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
};

/** Deterministic pseudo “availability” by hashing date+time (stable across renders) */
const availabilityFromSeed = (seedStr: string) => {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  const pct = h % 100; // 0..99
  return pct > 30; // ~69% available
};

const ReservationCalendar: React.FC = () => {
  const { reservationData, updateReservationData, nextStep } = useReservation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(reservationData.date);
  const [selectedTime, setSelectedTime] = useState<string>(reservationData.time);
  const [guests, setGuests] = useState<number>(reservationData.guests);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    reservationData.date ? new Date(reservationData.date) : new Date()
  );

  /** Slots base */
  const lunchSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
  const dinnerSlots = [
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
  ];

  /** Generate timeslots for a given date (deterministic, respects current exact time if today) */
  const timeSlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    const isToday =
      selectedDate.toDateString() === new Date().toDateString();

    const slots: TimeSlot[] = [];
    const all = [...lunchSlots, ...dinnerSlots];

    for (const time of all) {
      const slotDate = combineDateTime(selectedDate, time);
      const afterNow = !isToday || slotDate.getTime() > Date.now();

      const seed = `${toYMD(selectedDate)}_${time}`;
      const avail = afterNow && availabilityFromSeed(seed);

      slots.push({
        id: `slot-${seed}`,
        time,
        available: avail,
      });
    }
    return slots;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  /** When month changes and selectedDate goes out of view, do nothing; keep selection persistent */
  useEffect(() => {
    // If no selected date yet, default to today (not earlier than today)
    if (!selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
    }
  }, [selectedDate]);

  /** Calendar helpers */
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0=Sun .. 6=Sat

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month fillers
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, 1 - (i + 1)), isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Next month fillers to 42 cells
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => setSelectedTime(time);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateReservationData({
        date: selectedDate,
        time: selectedTime,
        guests,
      });
      nextStep();
    }
  };

  const isDateDisabled = (date: Date) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return date < t;
  };

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const monthFormatter = new Intl.DateTimeFormat("es-CR", {
    month: "long",
    year: "numeric",
  });
  const weekdayShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const isToday = (d: Date) =>
    d.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Selecciona Fecha y Hora
        </h2>
        <p className="text-gray-600">
          Disfruta de una experiencia gastronómica única en nuestro restaurante
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mes anterior"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold capitalize">
              {monthFormatter.format(currentMonth)}
            </h3>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                )
              }
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Mes siguiente"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayShort.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth }, index) => {
              const disabled = !isCurrentMonth || isDateDisabled(date);
              const selected =
                selectedDate?.toDateString() === date.toDateString() && !disabled;

              return (
                <button
                  key={`${toYMD(date)}-${index}`}
                  onClick={() => isCurrentMonth && !disabled && handleDateSelect(date)}
                  disabled={disabled}
                  role="button"
                  aria-pressed={selected}
                  className={`
                    p-2 text-sm rounded-lg transition-all duration-200 outline-none
                    ${
                      !isCurrentMonth
                        ? "text-gray-300 cursor-not-allowed"
                        : disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : selected
                        ? `bg-[${BLUE}] text-white shadow-md`
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    ${isToday(date) && !selected ? "ring-1 ring-gray-300" : ""}
                  `}
                  style={
                    selected
                      ? { backgroundColor: BLUE, color: "#fff" }
                      : undefined
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time and Details Section */}
        <div>
          {/* Guest Selection */}
          <div className="mb-6">
            <label
              htmlFor="guests"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Users className="inline w-4 h-4 mr-1" />
              Número de comensales
            </label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--blue)] focus:border-[color:var(--blue)]"
              style={
                {
                  "--blue": BLUE,
                } as React.CSSProperties
              }
              aria-label="Número de comensales"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? "persona" : "personas"}
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
                {/* Almuerzo */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Almuerzo
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots
                      .filter((s) => {
                        const h = parseInt(s.time.split(":")[0]);
                        return h >= 12 && h < 16;
                      })
                      .map((slot) => {
                        const selected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            role="button"
                            aria-pressed={selected}
                            className={`
                              p-2 text-sm rounded-lg border transition-all duration-200 outline-none
                              ${
                                !slot.available
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  : selected
                                  ? "text-white border-transparent shadow-md"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }
                            `}
                            style={
                              selected
                                ? { backgroundColor: BLUE }
                                : undefined
                            }
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Cena */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Cena</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots
                      .filter((s) => parseInt(s.time.split(":")[0]) >= 19)
                      .map((slot) => {
                        const selected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            role="button"
                            aria-pressed={selected}
                            className={`
                              p-2 text-sm rounded-lg border transition-all duration-200 outline-none
                              ${
                                !slot.available
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  : selected
                                  ? "text-white border-transparent shadow-md"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }
                            `}
                            style={
                              selected
                                ? { backgroundColor: BLUE }
                                : undefined
                            }
                          >
                            {slot.time}
                          </button>
                        );
                      })}
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
              ${
                selectedDate && selectedTime
                  ? "text-white shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
            style={
              selectedDate && selectedTime
                ? { backgroundColor: BLUE }
                : undefined
            }
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
