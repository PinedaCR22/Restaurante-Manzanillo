import { useState } from "react";
import { Edit3, Trash2, EyeOff, Eye } from "lucide-react";
import type { Dish } from "../../../types/menu/dish";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";

type Props = {
  dish: Dish;
  categoryName: string;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
};

export default function DishCard({
  dish,
  categoryName,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  const { id, name, price, description, isActive } = dish;
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleConfirmDelete() {
    onDelete(id);
    setConfirmDelete(false);
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#0D784A]/50 transition flex flex-col justify-between">
        {/* 🧾 Encabezado */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
            {name}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* 💵 Precio y categoría */}
        <div className="text-sm text-gray-700 mb-2">
          <p>
            <span className="font-medium text-[#0D784A]">
              ₡{price.toLocaleString()}
            </span>
          </p>
          <p className="text-gray-500 italic">{categoryName}</p>
        </div>

        {/* 🍴 Descripción */}
        <p className="text-sm text-gray-700 flex-1 mb-3 line-clamp-3 break-words">
          {description || "Sin descripción."}
        </p>

        {/* ⚙️ Acciones */}
        <div className="flex flex-wrap justify-end gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(dish)}
            className="flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            <Edit3 size={14} />
            Editar
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            <Trash2 size={14} />
            Eliminar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(id, !isActive)}
            className="flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            {isActive ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
      </div>

      {/* ConfirmDialog agregado */}
      <ConfirmDialog
        open={confirmDelete}
        message={`¿Eliminar el platillo "${name}"?`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
