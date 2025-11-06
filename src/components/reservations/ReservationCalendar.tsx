// src/components/reservations/ReservationCalendar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, AlertCircle } from "lucide-react";
import { useReservation } from "../../hooks/public/useReservation";
import type { TimeSlot } from "../../types/reservation";

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

const ReservationCalendar: React.FC = () => {
  const { reservationData, updateReservationData, nextStep } = useReservation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(reservationData.date);
  const [selectedTime, setSelectedTime] = useState<string>(reservationData.time);
  const [peopleCount, setPeopleCount] = useState<number | null>(
    reservationData.peopleCount ?? null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    reservationData.date ? new Date(reservationData.date) : new Date()
  );
  const [warning, setWarning] = useState<string>("");

  // ✅ Seleccionar fecha inicial
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
      setCurrentMonth(new Date(today));
    }
  }, [selectedDate]);

  // ✅ Generar horarios disponibles
  const timeSlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    const slots: TimeSlot[] = [];

    for (let hour = 11; hour <= 18; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 18 && minute === 30) continue;
        const time = `${String(hour).padStart(2, "0")}:${minute === 0 ? "00" : "30"}`;
        const dt = combineDateTime(selectedDate, time);
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        const available = !isToday || dt.getTime() > Date.now();

        slots.push({
          id: `slot-${toYMD(selectedDate)}-${time}`,
          time,
          available,
        });
      }
    }
    return slots;
  }, [selectedDate]);

  // ✅ Límite real del backend: 1–30 personas
  const handlePeopleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (digits === "") {
      setPeopleCount(null);
      setWarning("");
      return;
    }

    const value = Number(digits);
    setPeopleCount(value);

    if (value > 30) {
      setWarning("El número máximo permitido es 30 personas.");
    } else if (value < 1) {
      setWarning("Debe haber al menos 1 persona.");
    } else {
      setWarning("");
    }
  };

  const allowedKeys = new Set([
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ]);

  // ✅ Continuar
  const handleContinue = () => {
    if (selectedDate && selectedTime && peopleCount && peopleCount >= 1 && peopleCount <= 30) {
      updateReservationData({
        date: selectedDate,
        time: selectedTime,
        peopleCount,
      });
      nextStep();
    }
  };

  // ✅ Calendario
  const days = useMemo(() => {
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const arr: { date: Date; isCurrentMonth: boolean }[] = [];

      const startDow = firstDay.getDay();
      for (let i = startDow - 1; i >= 0; i--) {
        arr.push({ date: new Date(year, month, 1 - (i + 1)), isCurrentMonth: false });
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        arr.push({ date: new Date(year, month, d), isCurrentMonth: true });
      }

      while (arr.length < 42) {
        const nextDate = new Date(year, month + 1, arr.length - (startDow + lastDay.getDate()) + 1);
        arr.push({ date: nextDate, isCurrentMonth: false });
      }

      return arr;
    };

    return getDaysInMonth(currentMonth);
  }, [currentMonth]);

  const monthFormatter = new Intl.DateTimeFormat("es-CR", {
    month: "long",
    year: "numeric",
  });

  const weekdayShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const isPastDay = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d < today;
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 max-w-4xl mx-auto text-app border">
      <h2 className="text-2xl font-bold mb-2">Selecciona fecha y hora</h2>
      <p className="text-muted mb-4">
        Disfruta de una experiencia gastronómica única
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ✅ Calendario ------------------------------------------------ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold capitalize">
              {monthFormatter.format(currentMonth)}
            </h3>

            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayShort.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map(({ date, isCurrentMonth }, i) => {
              const disabled = !isCurrentMonth || isPastDay(date);
              const selected =
                selectedDate?.toDateString() === date.toDateString() && !disabled;

              return (
                <button
                  key={i}
                  onClick={() => !disabled && setSelectedDate(date)}
                  disabled={disabled}
                  className={`p-2 text-sm rounded-lg ${
                    selected
                      ? "text-white"
                      : disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  style={selected ? { backgroundColor: BLUE } : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ Horarios + Personas -------------------------------------- */}
        <div>
          {/* Personas */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Número de comensales
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={peopleCount ?? ""}
              onChange={(e) => handlePeopleChange(e.target.value)}
              onKeyDown={(e) => {
                if (!allowedKeys.has(e.key) && !/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full p-3 rounded-lg border bg-app"
              placeholder="Ingresa cantidad"
            />

            {warning && (
              <p className="mt-2 text-sm text-yellow-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {warning}
              </p>
            )}
          </div>

          {/* Horarios */}
          {selectedDate && (
            <>
              <label className="block text-sm font-medium mb-3">
                <Clock className="inline w-4 h-4 mr-1" />
                Horarios disponibles
              </label>

              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const selected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-2 text-sm rounded-lg border ${
                        !slot.available
                          ? "cursor-not-allowed opacity-60"
                          : selected
                          ? "text-white border-transparent"
                          : "hover:bg-gray-100"
                      }`}
                      style={selected ? { backgroundColor: BLUE } : undefined}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime || !peopleCount}
            className="mt-6 w-full py-3 px-4 rounded-lg text-white disabled:opacity-50"
            style={{
              backgroundColor:
                !selectedDate || !selectedTime || !peopleCount ? "gray" : BLUE,
            }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
