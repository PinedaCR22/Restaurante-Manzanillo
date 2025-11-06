import { useEffect, useMemo, useState } from "react";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass } from "../../ui/FormField";
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
  const [customKind, setCustomKind] = useState("");
  const [value, setValue] = useState(initial?.value ?? "");
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 1);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
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

  const effectiveKind = useMemo(
    () => (category === "other" ? customKind.trim() || "otros" : category),
    [category, customKind]
  );

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!value.trim()) newErrors.value = "El campo de contacto es obligatorio.";
    if (category === "other" && !customKind.trim())
      newErrors.kind = "Debes especificar el tipo de contacto.";
    if (displayOrder < 1 || isNaN(displayOrder))
      newErrors.displayOrder = "Debe ser un número mayor o igual a 1.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      kind: effectiveKind.toLowerCase(),
      value: value.trim(),
      displayOrder,
      isActive,
    });
    onClose();
  };

  return (
    <ModalBase
      open={open}
      title={initial && "id" in initial ? "Editar contacto" : "Nuevo contacto"}
      onClose={onClose}
      width="550px"
    >
      <FormLayout
        title=""
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={saving}
      >
        {/* Tipo de contacto */}
        <FormField label="Tipo de contacto">
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
                      ? "border-[#0D784A] bg-[#0D784A] text-white"
                      : "border-[#C6E3D3] text-[#0D784A] hover:bg-[#E6F4EE]"
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
                placeholder="Ej: WhatsApp, Telegram…"
                className={inputClass + (errors.kind ? " border-red-400" : "")}
              />
              {errors.kind && (
                <p className="mt-1 text-xs text-red-600">{errors.kind}</p>
              )}
            </div>
          )}
        </FormField>

        {/* Valor */}
        <FormField label="Información de contacto">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ej: +506…, correo@…, https://…"
            className={inputClass + (errors.value ? " border-red-400" : "")}
          />
          {errors.value && (
            <p className="mt-1 text-xs text-red-600">{errors.value}</p>
          )}
        </FormField>

        {/* Orden y estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Orden de visualización">
            <input
              type="number"
              min={1}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value || 1))}
              className={inputClass + (errors.displayOrder ? " border-red-400" : "")}
            />
            {errors.displayOrder && (
              <p className="mt-1 text-xs text-red-600">
                {errors.displayOrder}
              </p>
            )}
          </FormField>

          <FormField label="Visible en el sitio">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="text-sm text-[#0D784A] font-medium">
                Activo
              </span>
            </label>
          </FormField>
        </div>
      </FormLayout>
    </ModalBase>
  );
}
