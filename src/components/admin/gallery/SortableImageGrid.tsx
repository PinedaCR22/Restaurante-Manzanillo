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
import { Eye, EyeOff, Trash2, X } from "lucide-react";
import type { GalleryImage } from "../../../types/gallery";
import { resolveImageUrl } from "../../../helpers/media";
import { useState } from "react";

// ===============================
// 📸 Tarjeta individual
// ===============================
type ItemProps = {
  img: GalleryImage;
  onToggle: (img: GalleryImage) => void | Promise<void>;
  onDelete: (img: GalleryImage) => void | Promise<void>;
  onPreview: (img: GalleryImage) => void;
};

function SortableCard({ img, onToggle, onDelete, onPreview }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const src = resolveImageUrl(img.filePath) ?? "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200"
    >
      <div className="relative group">
        <img
          src={src}
          alt=""
          className="h-44 w-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
          onClick={() => onPreview(img)}
          {...attributes}
          {...listeners}
        />

        {!img.isVisible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
            Oculta
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 p-2">
        <div className="text-xs text-slate-500 font-medium">#{img.displayOrder}</div>
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

// ===============================
// 🧩 Grid con DnD + Modal Preview
// ===============================
export default function SortableImageGrid({
  images,
  page,
  pageSize,
  onPageReorder,
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

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = images.slice(start, end);
  const ids = pageItems.map((i) => i.id);

  const [preview, setPreview] = useState<GalleryImage | null>(null);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = pageItems.findIndex((x) => x.id === active.id);
    const newIndex = pageItems.findIndex((x) => x.id === over.id);
    const reorderedPage = arrayMove(pageItems, oldIndex, newIndex);

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
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((img) => (
              <SortableCard
                key={img.id}
                img={img}
                onToggle={onToggle}
                onDelete={onDelete}
                onPreview={setPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* 🔍 Modal de vista ampliada */}
      {preview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl w-[90%]">
            <img
              src={resolveImageUrl(preview.filePath) ?? ""}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
