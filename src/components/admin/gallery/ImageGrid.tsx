import { useState } from "react";
import { resolveImageUrl } from "../../../helpers/media";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import ConfirmDialog from "../../ui/ConfirmDialog";
import type { GalleryImage } from "../../../types/gallery";

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
  const [confirmImg, setConfirmImg] = useState<GalleryImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-[#C6E3D3] bg-white p-6 text-center text-gray-500 shadow-sm">
        Sin imágenes.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {images.map((img) => {
          const src = resolveImageUrl(img.filePath) ?? "";
          return (
            <div
              key={img.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl hover:border-[#0D784A]/40 transition-all duration-200"
            >
              {/* Imagen */}
              <img
                src={src}
                alt=""
                className="h-48 w-full object-cover rounded-t-2xl cursor-pointer transition-transform duration-200 hover:scale-105"
              />

              {/* Pie de card */}
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-sm font-medium text-gray-600">
                  #{img.displayOrder}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onMove(img, "up")}
                    className="rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 transition"
                    title="Subir"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onMove(img, "down")}
                    className="rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 transition"
                    title="Bajar"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onToggle(img)}
                    className={`rounded-lg border p-2 transition ${
                      img.isVisible
                        ? "border-gray-200 bg-gray-50 hover:bg-gray-100 text-[#0D784A]"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500"
                    }`}
                    title={img.isVisible ? "Ocultar" : "Mostrar"}
                  >
                    {img.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* 🔴 Botón eliminar rojo sólido */}
                  <button
                    onClick={() => setConfirmImg(img)}
                    className="rounded-lg bg-red-600 hover:bg-red-700 text-white p-2 transition flex items-center justify-center"
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

      {/* Confirmación */}
      <ConfirmDialog
        open={!!confirmImg}
        message={`¿Eliminar esta imagen?`}
        onCancel={() => setConfirmImg(null)}
        onConfirm={() => {
          if (confirmImg) onDelete(confirmImg);
          setConfirmImg(null);
        }}
      />
    </>
  );
}
