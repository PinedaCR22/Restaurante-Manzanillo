import { useState, useEffect } from "react";
import ModalBase from "../../ui/ModalBase";
import FormField, {
  inputClass,
  selectClass,
  textAreaClass,
} from "../../ui/FormField";
import { restaurantReservationService } from "../../../services/restaurant-reservations/restaurantReservation.service";
import SuccessDialog from "../../ui/SuccessDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ReservaFormData) => void;
}

export interface ReservaFormData {
  customerName: string;
  phone: string;
  email: string;
  peopleCount: number;
  zone: string;
  tableNumber: number;
  date: string;
  time: string;
  note?: string;
}

export default function CreateReservaModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<ReservaFormData>({
    customerName: "",
    phone: "",
    email: "",
    peopleCount: 1,
    zone: "",
    tableNumber: 0,
    date: "",
    time: "",
    note: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loadingHours, setLoadingHours] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [savingReservation, setSavingReservation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [availableTables, setAvailableTables] = useState<number[]>([]);

  // 🔹 Zonas definidas directamente en el select
  const ZONAS = ["Terraza", "Salón Interior", "Área Privada", "Zona Bar"];

  // ✅ Fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 🔄 Cargar horarios al cambiar la fecha
  useEffect(() => {
    if (!form.date) {
      setAvailableHours([]);
      return;
    }

    const fetchHours = async () => {
      try {
        setLoadingHours(true);
        setError(null);
        const hours = await restaurantReservationService.getAvailableHours(form.date);
        setAvailableHours(hours);
        if (form.time && !hours.includes(form.time)) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      } catch (err) {
        console.error("Error obteniendo horarios:", err);
        setError("Error al obtener horarios disponibles");
        setAvailableHours([]);
      } finally {
        setLoadingHours(false);
      }
    };

    fetchHours();
  }, [form.date]);

  // 🔄 Cargar mesas disponibles
  useEffect(() => {
    if (!form.date || !form.time || !form.zone) {
      setAvailableTables([]);
      return;
    }

    const fetchTables = async () => {
      try {
        setLoadingTables(true);
        setError(null);
        const tables = await restaurantReservationService.getAvailableTables(
          form.date,
          form.time,
          form.zone
        );
        setAvailableTables(tables);
        if (form.tableNumber && !tables.includes(form.tableNumber)) {
          setForm((prev) => ({ ...prev, tableNumber: 0 }));
        }
      } catch (err) {
        console.error("Error obteniendo mesas:", err);
        setError("Error al obtener mesas disponibles");
        setAvailableTables([]);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [form.date, form.time, form.zone]);

  // ✅ Validaciones
  const isValidEmail = (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{8,20}$/.test(phone);
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.customerName.trim() || form.customerName.trim().length < 3)
      return setError("El nombre del cliente debe tener al menos 3 caracteres.");

    if (!isValidPhone(form.phone))
      return setError("El teléfono debe tener entre 8 y 20 caracteres.");

    if (form.email && !isValidEmail(form.email))
      return setError("El correo electrónico no es válido.");

    if (!form.date) return setError("Debes seleccionar una fecha válida.");
    if (!form.time) return setError("Debes seleccionar una hora válida.");
    if (!availableHours.includes(form.time))
      return setError("La hora seleccionada ya no está disponible.");
    if (form.peopleCount < 1) return setError("Debe haber al menos 1 persona.");
    if (form.peopleCount > 30)
      return setError("⚠️ La capacidad máxima por reserva es de 30 personas.");
    if (!form.zone) return setError("Debes seleccionar una zona.");
    if (!form.tableNumber) return setError("Debes seleccionar una mesa.");
    if (!availableTables.includes(form.tableNumber))
      return setError("La mesa seleccionada ya no está disponible.");

    try {
      setSavingReservation(true);
      await onSave(form);
      setForm({
        customerName: "",
        phone: "",
        email: "",
        peopleCount: 1,
        zone: "",
        tableNumber: 0,
        date: "",
        time: "",
        note: "",
      });
      setAvailableHours([]);
      setAvailableTables([]);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error al guardar:", err);
      if (err instanceof Error) setError(err.message);
    } finally {
      setSavingReservation(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleClose = () => {
    setForm({
      customerName: "",
      phone: "",
      email: "",
      peopleCount: 1,
      zone: "",
      tableNumber: 0,
      date: "",
      time: "",
      note: "",
    });
    setAvailableHours([]);
    setAvailableTables([]);
    setError(null);
    onClose();
  };

  return (
    <>
      <ModalBase open={open} onClose={handleClose} title="Registrar nueva reserva">
        <div className="max-h-[80vh] overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-lg mx-auto"
          >
            <h2 className="text-base font-semibold text-[#0D784A]">Datos del cliente</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nombre del cliente *">
                <input
                  className={inputClass}
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Teléfono *">
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Correo electrónico (opcional)">
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </FormField>

              <FormField label="Cantidad de personas *">
                <input
                  type="number"
                  min={1}
                  max={30}
                  className={inputClass}
                  value={form.peopleCount}
                  onChange={(e) =>
                    setForm({ ...form, peopleCount: Number(e.target.value) })
                  }
                />
              </FormField>
            </div>

            <h2 className="text-base font-semibold text-[#0D784A]">Detalles de la reserva</h2>

            <FormField label="Fecha *">
              <input
                type="date"
                className={inputClass}
                value={form.date}
                min={getMinDate()}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setForm({
                    ...form,
                    date: selectedDate,
                    time: "",
                    tableNumber: 0,
                  });
                  setAvailableHours([]);
                  setAvailableTables([]);
                }}
                required
              />
            </FormField>

            <FormField label="Hora *">
              {!form.date ? (
                <div className="text-sm text-gray-500 italic py-2">
                  Primero selecciona una fecha
                </div>
              ) : loadingHours ? (
                <div className="text-sm text-gray-500 italic py-2">
                  Cargando horarios...
                </div>
              ) : availableHours.length === 0 ? (
                <div className="text-sm text-amber-600 italic py-2">
                  No hay horarios disponibles
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-1">
                  {availableHours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, time: hour, tableNumber: 0 })
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition ${
                        form.time === hour
                          ? "bg-[#0D784A] text-white border-[#0D784A]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#0D784A]"
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              )}
            </FormField>

            <FormField label="Zona *">
              <select
                className={selectClass}
                value={form.zone}
                onChange={(e) =>
                  setForm({ ...form, zone: e.target.value, tableNumber: 0 })
                }
                required
                disabled={!form.time}
              >
                <option value="">
                  {!form.time
                    ? "Primero selecciona fecha y hora"
                    : "Selecciona una zona"}
                </option>
                {ZONAS.map((zona) => (
                  <option key={zona} value={zona}>
                    {zona}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Mesa asignada *">
              {!form.zone ? (
                <div className="text-sm text-gray-500 italic py-2">
                  Selecciona fecha, hora y zona
                </div>
              ) : loadingTables ? (
                <div className="text-sm text-gray-500 italic py-2">
                  Cargando mesas...
                </div>
              ) : availableTables.length === 0 ? (
                <div className="text-sm text-amber-600 italic py-2">
                  No hay mesas disponibles
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-1">
                  {availableTables.map((mesa) => (
                    <button
                      key={mesa}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, tableNumber: mesa })
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition ${
                        form.tableNumber === mesa
                          ? "bg-[#0D784A] text-white border-[#0D784A]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#0D784A]"
                      }`}
                    >
                      #{mesa}
                    </button>
                  ))}
                </div>
              )}
            </FormField>

            <FormField label="Notas adicionales (opcional)">
              <textarea
                className={textAreaClass}
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
                rows={3}
                placeholder="Ej: Celebración, decoración..."
              />
            </FormField>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="border border-[#0D784A] text-[#0D784A] hover:bg-[#E6F4EE] font-medium rounded-lg px-4 py-2 transition w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingHours || loadingTables || savingReservation}
                className="bg-[#0D784A] hover:bg-[#0B6A41] text-white font-medium rounded-lg px-4 py-2 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingReservation ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  loadingHours || loadingTables ? "Validando..." : "Guardar reserva"
                )}
              </button>
            </div>
          </form>
        </div>
      </ModalBase>

      <SuccessDialog
        open={showSuccess}
        title="¡Reserva creada!"
        message="La reserva se ha registrado exitosamente."
        onClose={handleSuccessClose}
      />
    </>
  );
}