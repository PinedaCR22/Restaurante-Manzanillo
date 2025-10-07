import type { GalleryImage } from "../../../types/gallery";
import { resolveImageUrl } from "../../../helpers/media";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ImageGrid({
  images,
  onMove,
  onToggle,
  onDelete,
}: {
  images: GalleryImage[];
  onMove: (img: GalleryImage, dir: "up" | "down") => void | Promise<void>;
  onToggle: (img: GalleryImage) => void | Promise<void>;
  onDelete: (img: GalleryImage) => void | Promise<void>;
}) {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Sin imágenes.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {images.map((img) => {
        const src = resolveImageUrl(img.filePath) ?? "";
        return (
          <div key={img.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img src={src} alt="" className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="text-xs text-slate-500">#{img.displayOrder}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onMove(img, "up")}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  title="Subir"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onMove(img, "down")}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  title="Bajar"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
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
      })}
    </div>
  );
}
