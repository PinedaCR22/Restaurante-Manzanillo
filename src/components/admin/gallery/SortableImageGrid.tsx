// src/components/admin/gallery/SortableImageGrid.tsx
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { GalleryImage } from "../../../types/gallery";
import { resolveImageUrl } from "../../../helpers/media";

type ItemProps = {
  img: GalleryImage;
  onToggle: (img: GalleryImage) => void | Promise<void>;
  onDelete: (img: GalleryImage) => void | Promise<void>;
};
function SortableCard({ img, onToggle, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const src = resolveImageUrl(img.filePath) ?? "";

  return (
    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <img
        src={src}
        alt=""
        className="h-40 w-full cursor-grab select-none object-cover"
        {...attributes}
        {...listeners}
      />
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="text-xs text-slate-500">#{img.displayOrder}</div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(img)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
            title={img.isVisible ? "Ocultar" : "Mostrar"}
          >
            {img.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(img)}
            className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SortableImageGrid({
  images,
  page,
  pageSize,
  onPageReorder, // recibe la LISTA COMPLETA ya reordenada (con la página mezclada)
  onToggle,
  onDelete,
}: {
  images: GalleryImage[];
  page: number;
  pageSize: number;
  onPageReorder: (reorderedAll: GalleryImage[]) => void | Promise<void>;
  onToggle: (img: GalleryImage) => void | Promise<void>;
  onDelete: (img: GalleryImage) => void | Promise<void>;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // slice de la página
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = images.slice(start, end);
  const ids = pageItems.map((i) => i.id);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    // Reordenamos solo dentro del slice
    const oldIndex = pageItems.findIndex((x) => x.id === active.id);
    const newIndex = pageItems.findIndex((x) => x.id === over.id);
    const reorderedPage = arrayMove(pageItems, oldIndex, newIndex);

    // Pegamos: antes de la página + página reordenada + después
    const prefix = images.slice(0, start);
    const suffix = images.slice(end);
    const merged = [...prefix, ...reorderedPage, ...suffix];

    void onPageReorder(merged);
  }

  if (pageItems.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Sin imágenes en esta página.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((img) => (
            <SortableCard key={img.id} img={img} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
