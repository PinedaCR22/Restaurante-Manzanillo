import type { PageSection, SectionForm } from "../../../types/cms";

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
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">
          {editing ? "Editar sección" : "Nueva sección"}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Clave (sectionKey)</label>
            <input
              value={form.sectionKey}
              onChange={(e) => setForm({ ...form, sectionKey: e.target.value })}
              disabled={!!editing}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            {editing && <p className="mt-1 text-xs text-slate-500">No se puede cambiar la clave.</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Título del panel</label>
            <input
              value={form.panelTitle ?? ""}
              onChange={(e) => setForm({ ...form, panelTitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Visible</span>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700/90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
