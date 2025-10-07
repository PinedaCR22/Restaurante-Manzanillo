import type { PageSection } from "../../../types/cms";
import { Pencil, Trash2 } from "lucide-react";

export default function SectionList({
  sections,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: {
  sections: PageSection[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (s: PageSection) => void;
  onDelete: (s: PageSection) => void;
}) {
  if (sections.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No hay secciones.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((s) => (
        <div
          key={s.id}
          className={`relative rounded-2xl border p-4 ${
            selectedId === s.id ? "border-blue-600" : "border-slate-200"
          }`}
        >
          <button onClick={() => onSelect(s.id)} className="block w-full text-left">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">{s.panelTitle || s.sectionKey}</div>
              <span className="text-xs text-slate-500">{s.isVisible ? "Visible" : "Oculta"}</span>
            </div>
            <p className="text-sm text-slate-600">Clave: <span className="font-mono">{s.sectionKey}</span></p>
          </button>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onEdit(s)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" /> Editar
            </button>
            <button
              onClick={() => onDelete(s)}
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
