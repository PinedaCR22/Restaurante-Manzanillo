import type { Category } from "../../../types/menu/category";
import type { Dish } from "../../../types/menu/dish";
import type { DishEditorForm } from "../../../types/menu/forms";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  editing: Dish | null;

  form: DishEditorForm;
  setForm: React.Dispatch<React.SetStateAction<DishEditorForm>>;
  onSubmit: () => Promise<void> | void;
  loading?: boolean;
};

export default function DishModal({
  open,
  onClose,
  categories,
  editing,
  form,
  setForm,
  onSubmit,
  loading = false,
}: Props) {
  const invalidName = !form.name.trim();
  const invalidPrice = Number(form.price) <= 0;
  const invalidCat = !form.categoryId;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (invalidName || invalidPrice || invalidCat) return;
    await onSubmit();
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Editar platillo" : "Nuevo platillo"}>
      <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej: Paella Marina"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
          />
          {invalidName && <p className="mt-1 text-xs text-red-600">Nombre requerido</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Precio (CRC)</label>
          <input
            type="number"
            min={1}
            step={1}
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.valueAsNumber || 0 }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
          />
          {invalidPrice && <p className="mt-1 text-xs text-red-600">Precio debe ser mayor a 0</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Categoría</label>
          <select
            value={form.categoryId || ""}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) || "" }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
          >
            <option value="" disabled>Selecciona…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {invalidCat && <p className="mt-1 text-xs text-red-600">Categoría requerida</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
            placeholder="Opcional…"
          />
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 accent-[#0D784A]"
            />
            Disponible
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || invalidName || invalidPrice || invalidCat}
            className="rounded-lg bg-[#0D784A] hover:bg-[#0B6A41] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
