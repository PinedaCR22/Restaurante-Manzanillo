import type { PageSection, SectionForm } from "../../../types/cms";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass } from "../../ui/FormField";

export default function SectionFormModal({
  open,
  editing,
  form,
  setForm,
  saving,
  onSubmit,
  onClose,
}: {
  open: boolean;
  editing: PageSection | null;
  form: SectionForm;
  setForm: (next: SectionForm) => void;
  saving: boolean;
  onSubmit: () => void | Promise<void>;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <ModalBase open={open} title={editing ? "Editar sección" : "Nueva sección"} onClose={onClose} width="500px">
      <div className="max-h-[80vh] overflow-y-auto sm:p-1">
        <FormLayout
          title="Datos de la sección"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          onCancel={onClose}
          submitting={saving}
        >
          <FormField label="Clave (sectionKey)">
            <input
              value={form.sectionKey}
              onChange={(e) => setForm({ ...form, sectionKey: e.target.value })}
              disabled={!!editing}
              className={inputClass}
            />
            {editing && (
              <p className="mt-1 text-xs text-gray-500">No se puede cambiar la clave.</p>
            )}
          </FormField>

          <FormField label="Título del panel">
            <input
              value={form.panelTitle ?? ""}
              onChange={(e) => setForm({ ...form, panelTitle: e.target.value })}
              className={inputClass}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={!!form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              className="h-4 w-4 accent-[#0D784A]"
            />
            <span className="text-sm text-gray-700">Visible</span>
          </div>
        </FormLayout>
      </div>
    </ModalBase>
  );
}
