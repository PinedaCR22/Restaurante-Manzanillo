import type { Gallery, GalleryForm } from "../../../types/gallery";
import { ImagePlus } from "lucide-react";

export default function GalleryFormModal({
  open,
  editing,
  form,
  setForm,
  saving,
  onSubmit,
  onClose,
}: {
  open: boolean;
  editing: Gallery | null;
  form: GalleryForm;
  setForm: (next: GalleryForm) => void;
  saving: boolean;
  onSubmit: () => void | Promise<void>;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">
          {editing ? "Editar galería" : "Nueva galería"}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción (opcional)
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-24 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Diseño</label>
            <select
              value={form.layout}
              onChange={(e) =>
                setForm({ ...form, layout: e.target.value as Gallery["layout"] })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="grid">Cuadrícula</option>
              <option value="carousel">Carrusel</option>
              <option value="mosaic">Mosaico</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="gal-active"
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <label htmlFor="gal-active" className="text-sm text-slate-700">
              Activa
            </label>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700/90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : (<><ImagePlus className="h-4 w-4" /> Guardar</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
