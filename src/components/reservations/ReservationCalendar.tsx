// components/reservations/ReservationCalendar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, AlertCircle } from "lucide-react";
import { useReservation } from "../../sections/homepage/reservationpage";
import type { TimeSlot } from "../../types/reservation";

/** Color principal */
const BLUE = "#50ABD7";

/** Utils */
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
  const [guests, setGuests] = useState<number | null>(
    reservationData.guests || null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    reservationData.date ? new Date(reservationData.date) : new Date()
  );
  const [warning, setWarning] = useState<string>("");

  /** Si no hay fecha seleccionada, usar HOY para que los horarios aparezcan de una */
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
      setCurrentMonth(new Date(today));
    }
  }, [selectedDate]);

  /** Generar horarios entre 11:00 y 18:00 cada 30 minutos */
  const timeSlots: TimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    const slots: TimeSlot[] = [];
    for (let hour = 11; hour <= 18; hour++) {
      for (const minute of [0, 30]) {
        const time = `${String(hour).padStart(2, "0")}:${minute === 0 ? "00" : "30"}`;
        if (hour === 18 && minute === 30) continue; // excluir 18:30
        const dt = combineDateTime(selectedDate, time);
        const isToday = selectedDate.toDateString() === new Date().toDateString();
        const available = !isToday || dt.getTime() > Date.now();
        slots.push({ id: `slot-${toYMD(selectedDate)}-${time}`, time, available });
      }
    }
    return slots;
  }, [selectedDate]);

  /** Solo dígitos, máx. 3, tope 40, con advertencias */
  const handleGuestsChange = (raw: string) => {
    // Mantener solo dígitos
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 2); // máximo 3 dígitos
    if (digitsOnly === "") {
      setGuests(null);
      setWarning("");
      return;
    }

    const value = Number(digitsOnly);
    setGuests(value);

    if (value > 40) {
      setWarning("El número máximo permitido de comensales por reserva es 40.");
    } else if (value >= 10) {
      setWarning(
        "Para reservas de 10 personas o más se requiere un anticipo parcial del servicio correspondiente."
      );
    } else {
      setWarning("");
    }
  };

  /** Evitar letras/signos al teclear */
  const allowKeys = new Set([
    "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"
  ]);
  const onKeyDownNumeric: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (allowKeys.has(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };
  const onBeforeInputNumeric: React.FormEventHandler<HTMLInputElement> = (e: any) => {
    const data: string = e.data ?? "";
    if (data && /\D/.test(data)) e.preventDefault();
  };
  const onPasteNumeric: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData("text");
    if (/\D/.test(text)) e.preventDefault();
  };

  /** Continuar al siguiente paso */
  const handleContinue = () => {
    if (selectedDate && selectedTime && guests && guests > 0 && guests <= 40) {
      updateReservationData({
        date: selectedDate,
        time: selectedTime,
        guests,
      });
      nextStep();
    }
  };

  /** Generar calendario del mes (con bloqueo de días pasados) */
  const days = useMemo(() => {
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days: { date: Date; isCurrentMonth: boolean }[] = [];

      // Relleno anterior
      const startDow = firstDay.getDay();
      for (let i = startDow - 1; i >= 0; i--) {
        days.push({ date: new Date(year, month, 1 - (i + 1)), isCurrentMonth: false });
      }

      // Días del mes
      for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push({ date: new Date(year, month, day), isCurrentMonth: true });
      }

      // Relleno posterior hasta 42 celdas
      while (days.length < 42) {
        const nextIndex = days.length - (startDow > 0 ? 0 : 0);
        const nextDate = new Date(year, month + 1, nextIndex - (lastDay.getDate() + startDow) + 1);
        days.push({ date: nextDate, isCurrentMonth: false });
      }

      return days;
    };
    return getDaysInMonth(currentMonth);
  }, [currentMonth]);

  /** Formateadores */
  const monthFormatter = new Intl.DateTimeFormat("es-CR", {
    month: "long",
    year: "numeric",
  });
  const weekdayShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  /** Helpers */
  const isPastDay = (date: Date) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < t;
  };

  return (
    <div className="bg-card text-app rounded-lg shadow-lg p-6 max-w-4xl mx-auto border border-[color:color-mix(in srgb,var(--fg) 12%,transparent)]">
      <div className="mb-1">
        <h2 className="text-2xl font-bold mb-2">Selecciona fecha y hora</h2>
        <p className="text-muted">
          Disfruta de una experiencia gastronómica única en nuestro restaurante
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendario */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
              className="p-2 rounded-full hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)] transition"
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
              className="p-2 rounded-full hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)] transition"
              aria-label="Mes siguiente"
              type="button"
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
            {days.map(({ date, isCurrentMonth }, index) => {
              const disabled = !isCurrentMonth || isPastDay(date);
              const selected =
                selectedDate?.toDateString() === date.toDateString() && !disabled;

              return (
                <button
                  key={`${toYMD(date)}-${index}`}
                  onClick={() => isCurrentMonth && !disabled && setSelectedDate(date)}
                  disabled={disabled}
                  className={`
                    p-2 text-sm rounded-lg transition-all duration-200 outline-none
                    ${!isCurrentMonth ? "opacity-50 cursor-not-allowed text-muted"
                      : disabled ? "opacity-60 cursor-not-allowed text-muted"
                      : selected ? "text-white shadow-md"
                      : "hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)]"}
                  `}
                  style={ selected ? { backgroundColor: BLUE } : { color: "var(--fg)" } }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalles: comensales + horarios */}
        <div>
          {/* Comensales */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Número de comensales
            </label>
            <input
              // Usamos type="text" para poder aplicar reglas de solo dígitos y longitud
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={guests === null ? "" : String(guests)}
              onChange={(e) => handleGuestsChange(e.target.value)}
              onKeyDown={onKeyDownNumeric}
              onBeforeInput={onBeforeInputNumeric}
              onPaste={onPasteNumeric}
              className="w-full p-3 rounded-lg bg-app text-app
                         border border-[color:color-mix(in srgb,var(--fg) 18%,transparent)]
                         focus:outline-none focus:ring-2
                         focus:ring-[color:color-mix(in srgb,var(--fg) 30%,transparent)]
                         focus:border-[color:color-mix(in srgb,var(--fg) 30%,transparent)]"
              placeholder="Ingresa cantidad de personas"
              aria-label="Número de comensales"
            />
            {warning && (
              <p className="mt-2 text-sm text-yellow-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {warning}
              </p>
            )}
          </div>

          {/* Horarios */}
          {selectedDate && (
            <div className="mb-2">
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
                      className={`
                        p-2 text-sm rounded-lg border transition-all duration-200 outline-none
                        ${!slot.available
                          ? "cursor-not-allowed opacity-60 text-muted border-[color:color-mix(in srgb,var(--fg) 12%,transparent)]"
                          : selected
                          ? "text-white border-transparent shadow-md"
                          : "bg-card text-app border-[color:color-mix(in srgb,var(--fg) 18%,transparent)] hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)]"}
                      `}
                      style={ selected ? { backgroundColor: BLUE } : undefined }
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continuar */}
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime || !guests || guests <= 0 || guests > 40}
            className="mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 text-white disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                !selectedDate || !selectedTime || !guests || guests <= 0 || guests > 40
                  ? "color-mix(in srgb, var(--fg) 25%, transparent)"
                  : BLUE,
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
