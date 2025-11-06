import type { PageSection } from "../../../types/cms";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../../ui/Button";

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
      <div className="rounded-2xl border border-[#C6E3D3] bg-white p-6 text-center text-[#0D784A]/70 shadow-sm">
        No hay secciones.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {sections.map((s) => (
        <div
          key={s.id}
          className={`rounded-2xl border p-5 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D784A]/40 ${
            selectedId === s.id ? "border-[#0D784A]" : "border-[#C6E3D3]"
          }`}
        >
          <button onClick={() => onSelect(s.id)} className="block w-full text-left">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-semibold text-[#0D784A]">{s.panelTitle || s.sectionKey}</div>
              <span className="text-xs text-gray-500">
                {s.isVisible ? "Visible" : "Oculta"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Clave: <span className="font-mono">{s.sectionKey}</span>
            </p>
          </button>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(s)}>
              <Pencil className="h-4 w-4" /> Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(s)}>
              <Trash2 className="h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
