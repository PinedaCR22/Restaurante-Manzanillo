import type { Gallery } from "../../../types/gallery";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

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
  if (galleries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No hay galerías.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {galleries.map((g) => (
        <div
          key={g.id}
          className={`relative rounded-2xl border p-4 ${
            selectedId === g.id ? "border-blue-600" : "border-slate-200"
          }`}
        >
          <button onClick={() => onSelect(g.id)} className="block w-full text-left">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">{g.title}</div>
              <span className="text-xs text-slate-500">{formatLayout(g.layout)}</span>
            </div>
            {g.description && <p className="text-sm text-slate-600">{g.description}</p>}
          </button>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onEdit(g)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" /> Editar
            </button>
            <button
              onClick={() => onToggleActive(g)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              {g.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}{" "}
              {g.isActive ? "Activa" : "Inactiva"}
            </button>
            <button
              onClick={() => onDelete(g)}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
