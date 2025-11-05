import ModalBase from "../../ui/ModalBase";
import FormField, {
  inputClass,
  textAreaClass,
  selectClass,
} from "../../ui/FormField";
import Button from "../../ui/Button";
import type { Category } from "../../../types/menu/category";
import type { Dish } from "../../../types/menu/dish";
import type { DishEditorForm } from "../../../types/menu/forms";

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
    <ModalBase
      open={open}
      onClose={onClose}
      title={editing ? "Editar platillo" : "Nuevo platillo"}
    >
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto p-2"
      >
        {/* 🧾 Nombre */}
        <FormField label="Nombre del platillo">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej: Filete de pescado a la plancha"
            className={inputClass}
            required
          />
          {invalidName && (
            <p className="text-xs text-red-600 mt-1">Nombre requerido</p>
          )}
        </FormField>

        {/* 💵 Precio y Categoría */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Precio (₡)">
            <input
              type="number"
              min={1}
              step={1}
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.valueAsNumber || 0 }))
              }
              className={inputClass}
              required
            />
            {invalidPrice && (
              <p className="text-xs text-red-600 mt-1">
                Precio debe ser mayor a 0
              </p>
            )}
          </FormField>

          <FormField label="Categoría">
            <select
              value={form.categoryId || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  categoryId: Number(e.target.value) || "",
                }))
              }
              className={selectClass}
              required
            >
              <option value="">Selecciona...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {invalidCat && (
              <p className="text-xs text-red-600 mt-1">Categoría requerida</p>
            )}
          </FormField>
        </div>

        {/* 📝 Descripción */}
        <FormField label="Descripción (opcional)">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={textAreaClass}
            placeholder="Detalles del platillo o ingredientes principales"
          />
        </FormField>

        {/* 🔘 Checkbox */}
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
            className="h-4 w-4 accent-[#0D784A]"
          />
          Disponible
        </label>

        {/* 🧩 Botones */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || invalidName || invalidPrice || invalidCat}
            isLoading={loading}
          >
            Guardar platillo
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
