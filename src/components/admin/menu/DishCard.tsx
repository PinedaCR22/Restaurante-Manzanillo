import type { Dish } from "../../../types/menu/dish";

function formatCRC(v: number | string) {
  const n = typeof v === "string" ? Number(v) : v;
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function DishCard({
  dish,
  categoryName,
  onEdit,
  onDelete,
  onToggle,
  draggable,
}: {
  dish: Dish;
  categoryName: string;
  onEdit: (d: Dish) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
  draggable?: boolean;
}) {
  const active = !!dish.isActive;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{dish.name}</h3>
          {categoryName && <p className="text-xs text-slate-500">{categoryName}</p>}
        </div>
        <div className="flex items-center gap-3">
          {draggable && <div className="cursor-grab select-none text-slate-300">⋮⋮</div>}
          <span className="text-xl font-extrabold text-slate-900">{formatCRC(dish.price)}</span>
        </div>
      </div>

      {dish.description && <p className="mb-3 text-sm text-slate-600">{dish.description}</p>}

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => onToggle(dish.id, e.target.checked)}
            className="h-4 w-4 accent-[#0D784A]"
          />
          {active ? "Disponible" : "Inactivo"}
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(dish)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(dish.id)}
            className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
