import { useEffect, useMemo, useState } from "react";
import type { ContactForm, ContactItem } from "../../../types/contact/contact";

type Props = {
  open: boolean;
  saving?: boolean;
  initial?: Partial<ContactForm | ContactItem>;
  onSubmit: (payload: ContactForm) => Promise<void> | void;
  onClose: () => void;
};

const CATEGORIES = [
  { key: "phone", label: "Teléfono" },
  { key: "email", label: "Correo" },
  { key: "address", label: "Dirección" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "other", label: "Otro" },
] as const;
type CategoryKey = (typeof CATEGORIES)[number]["key"];

export default function ContactFormModal({
  open,
  initial,
  saving,
  onSubmit,
  onClose,
}: Props) {
  const [category, setCategory] = useState<CategoryKey>("phone");
  const [customKind, setCustomKind] = useState<string>("");
  const [value, setValue] = useState<string>(initial?.value ?? "");
  const [displayOrder, setDisplayOrder] = useState<number>(
    initial?.displayOrder ?? 1
  );
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);

  // errores
  const [errors, setErrors] = useState<{ value?: string; kind?: string; displayOrder?: string }>({});

  useEffect(() => {
    if (!open) return;
    setValue(initial?.value ?? "");
    setDisplayOrder(initial?.displayOrder ?? 1);
    setIsActive(initial?.isActive ?? true);
    setErrors({});

    const k = (initial?.kind ?? "").toLowerCase();
    if (!k) {
      setCategory("phone");
      setCustomKind("");
    } else if (CATEGORIES.some((c) => c.key === k)) {
      setCategory(k as CategoryKey);
      setCustomKind("");
    } else {
      setCategory("other");
      setCustomKind(k);
    }
  }, [open, initial]);

  const effectiveKind = useMemo<string>(
    () => (category === "other" ? customKind.trim() || "otros" : category),
    [category, customKind]
  );

  // Validar campos
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!value.trim()) {
      newErrors.value = "El campo de contacto es obligatorio.";
    }
    if (category === "other" && !customKind.trim()) {
      newErrors.kind = "Debes especificar el tipo de contacto.";
    }
    if (displayOrder < 1 || isNaN(displayOrder)) {
      newErrors.displayOrder = "El orden debe ser un número mayor o igual a 1.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      kind: effectiveKind.toLowerCase(),
      value: value.trim(),
      displayOrder,
      isActive,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] grid place-items-center bg-black/40 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-2xl animate-slideUp">
        {/* header */}
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4 bg-emerald-50">
          <h3 className="text-lg font-semibold text-emerald-900">
            {initial && "id" in initial ? "Editar contacto" : "Nuevo contacto"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-emerald-800 hover:bg-emerald-100"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="px-5 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Categoría */}
          <div>
            <div className="mb-2 text-sm font-medium text-emerald-800">
              Tipo de contacto
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {category === "other" && (
              <div className="mt-3">
                <input
                  value={customKind}
                  onChange={(e) => setCustomKind(e.target.value)}
                  placeholder="Ej: whatsapp, x, telegram…"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 ${
                    errors.kind
                      ? "border-red-400 focus:ring-red-200"
                      : "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                {errors.kind && (
                  <p className="mt-1 text-xs text-red-600">{errors.kind}</p>
                )}
              </div>
            )}
          </div>

          {/* Valor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-800">
              Información de contacto <span className="text-red-500">*</span>
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ejemplo: +506…, correo@…, https://…"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 ${
                errors.value
                  ? "border-red-400 focus:ring-red-200"
                  : "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
            {errors.value && (
              <p className="mt-1 text-xs text-red-600">{errors.value}</p>
            )}
          </div>

          {/* Orden y visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-emerald-800">
                Orden de visualización
              </label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(Number(e.target.value || 1))
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 ${
                  errors.displayOrder
                    ? "border-red-400 focus:ring-red-200"
                    : "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                }`}
              />
              {errors.displayOrder ? (
                <p className="mt-1 text-xs text-red-600">
                  {errors.displayOrder}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-emerald-700/70">
                  Los menores aparecen primero.
                </p>
              )}
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500/20"
                />
                <span className="text-sm font-medium text-emerald-800">
                  Visible en el sitio
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 border-t border-emerald-100 bg-emerald-50 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!!saving}
            onClick={handleSubmit}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* animaciones */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
