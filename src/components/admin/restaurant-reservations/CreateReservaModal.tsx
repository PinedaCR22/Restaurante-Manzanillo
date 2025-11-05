import { useState } from "react";
import ModalBase from "../../ui/ModalBase";
import FormField, { inputClass, selectClass, textAreaClass } from "../../ui/FormField";

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
  tableNumber: number; // ✅ numérico, no string
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

  // 🔹 Mesas por zona (simulado, luego vendrá del backend)
  const mesasPorZona: Record<string, number[]> = {
    "Terraza": [1, 2, 3, 4, 5],
    "Salón Interior": [6, 7, 8, 9, 10, 11],
    "Área Privada": [12, 13, 14],
    "Zona Bar": [15, 16, 17, 18],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.customerName.trim() || !form.phone.trim()) {
      return setError("El nombre y el teléfono son obligatorios.");
    }
    if (!form.date || !form.time) {
      return setError("Por favor selecciona una fecha y una hora válidas.");
    }

    // 🕓 Validar hora permitida (11:00 a 18:00)
    const [hour, minute] = form.time.split(":").map(Number);
    if (hour < 11 || (hour >= 18 && !(hour === 18 && minute === 0))) {
      return setError("Solo se pueden realizar reservas entre las 11:00 a.m. y 6:00 p.m.");
    }

    if (form.peopleCount < 1 || form.peopleCount > 30) {
      return setError("La cantidad máxima permitida es de 30 personas por reserva.");
    }

    if (!form.zone || !form.tableNumber) {
      return setError("Debes seleccionar una zona y una mesa.");
    }

    // ✅ Si todo está bien → guardar
    onSave(form);

    // 🔄 Reset y cerrar modal
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
    onClose();
  };

  return (
    <ModalBase open={open} onClose={onClose} title="Registrar nueva reserva">
      <div className="max-h-[80vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-lg mx-auto"
        >
          {/* 🧾 Datos del cliente */}
          <h2 className="text-base font-semibold text-[#0D784A]">Datos del cliente</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Nombre del cliente">
              <input
                className={inputClass}
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Teléfono">
              <input
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Correo electrónico">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>

            <FormField label="Cantidad de personas">
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

          {/* 🍽️ Detalles de la reserva */}
          <h2 className="text-base font-semibold text-[#0D784A]">Detalles de la reserva</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Fecha">
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Hora">
              <input
                type="time"
                className={inputClass}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Zona">
              <select
                className={selectClass}
                value={form.zone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    zone: e.target.value,
                    tableNumber: 0,
                  })
                }
                required
              >
                <option value="">Selecciona una zona</option>
                {Object.keys(mesasPorZona).map((zona) => (
                  <option key={zona} value={zona}>
                    {zona}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Mesa asignada">
              <select
                className={selectClass}
                value={form.tableNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, tableNumber: Number(e.target.value) })
                }
                required
                disabled={!form.zone}
              >
                <option value="">Selecciona una mesa</option>
                {form.zone &&
                  mesasPorZona[form.zone]?.map((mesa) => (
                    <option key={mesa} value={mesa}>
                      Mesa #{mesa}
                    </option>
                  ))}
              </select>
            </FormField>

            <FormField label="Notas adicionales (opcional)" className="sm:col-span-2">
              <textarea
                className={textAreaClass}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Ej: Celebración de cumpleaños, requiere decoración..."
              />
            </FormField>
          </div>

          {/* ⚠️ Mensaje de error */}
          {error && <p className="text-red-600 text-sm font-medium mt-1">{error}</p>}

          {/* 🔘 Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#0D784A] text-[#0D784A] hover:bg-[#E6F4EE] font-medium rounded-lg px-4 py-2 transition w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#0D784A] hover:bg-[#0B6A41] text-white font-medium rounded-lg px-4 py-2 transition w-full sm:w-auto"
            >
              Guardar reserva
            </button>
          </div>
        </form>
      </div>
    </ModalBase>
  );
}
