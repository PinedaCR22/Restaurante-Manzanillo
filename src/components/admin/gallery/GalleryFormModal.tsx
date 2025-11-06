import { useEffect } from "react";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass, selectClass, textAreaClass } from "../../ui/FormField";
import Button from "../../ui/Button";
import type { Gallery, GalleryForm } from "../../../types/gallery";
import { ImagePlus } from "lucide-react";

type Props = {
  open: boolean;
  editing: Gallery | null;
  form: GalleryForm;
  setForm: (next: GalleryForm) => void;
  saving: boolean;
  onSubmit: () => void | Promise<void>;
  onClose: () => void;
};

export default function GalleryFormModal({
  open,
  editing,
  form,
  setForm,
  saving,
  onSubmit,
  onClose,
}: Props) {
  useEffect(() => {
    if (open && editing) {
      setForm({
        title: editing.title,
        description: editing.description ?? "",
        layout: editing.layout,
        isActive: editing.isActive,
      });
    }
  }, [open, editing]);

  if (!open) return null;

  return (
    <ModalBase
      open={open}
      title={editing ? "Editar galería" : "Nueva galería"}
      onClose={onClose}
      width="600px"
    >
      <FormLayout
        title=""
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onCancel={onClose}
        submitting={saving}
      >
        <FormField label="Título">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            required
          />
        </FormField>

        <FormField label="Descripción (opcional)">
          <textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={textAreaClass}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Diseño">
            <select
              value={form.layout}
              onChange={(e) =>
                setForm({ ...form, layout: e.target.value as Gallery["layout"] })
              }
              className={selectClass}
            >
              <option value="grid">Cuadrícula</option>
              <option value="carousel">Carrusel</option>
              <option value="mosaic">Mosaico</option>
            </select>
          </FormField>

          <FormField label="Visible en el sitio">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-sm text-[#0D784A] font-medium">
                {form.isActive ? "Activa" : "Inactiva"}
              </span>
            </label>
          </FormField>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <ImagePlus className="h-4 w-4" />
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </FormLayout>
    </ModalBase>
  );
}
