import { useState } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Gallery } from "../../../types/gallery";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";

function formatLayout(l: Gallery["layout"]) {
  if (l === "grid") return "Cuadrícula";
  if (l === "carousel") return "Carrusel";
  return "Mosaico";
}

export default function GalleryList({
  galleries,
  selectedId,
  onSelect,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  galleries: Gallery[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (g: Gallery) => void;
  onToggleActive: (g: Gallery) => void;
  onDelete: (g: Gallery) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<Gallery | null>(null);

  if (galleries.length === 0) {
    return (
      <div className="rounded-xl border border-[#C6E3D3] bg-white p-6 text-center text-slate-500">
        No hay galerías.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {galleries.map((g) => (
          <div
            key={g.id}
            className={`relative rounded-2xl border p-4 bg-white shadow-sm hover:shadow-md transition ${
              selectedId === g.id ? "border-[#0D784A]" : "border-gray-200"
            }`}
          >
            <button
              onClick={() => onSelect(g.id)}
              className="block w-full text-left focus:outline-none"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">{g.title}</div>
                <span className="text-xs text-gray-500">{formatLayout(g.layout)}</span>
              </div>
              {g.description && (
                <p className="text-sm text-gray-700">{g.description}</p>
              )}
            </button>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(g)}
              >
                <Pencil size={14} />
                Editar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleActive(g)}
              >
                {g.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                {g.isActive ? "Activa" : "Inactiva"}
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmDelete(g)}
              >
                <Trash2 size={14} />
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!confirmDelete}
        message={`¿Eliminar la galería "${confirmDelete?.title}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) onDelete(confirmDelete);
          setConfirmDelete(null);
        }}
      />
    </>
  );
}
