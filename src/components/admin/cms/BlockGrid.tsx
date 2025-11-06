import type { ContentBlock } from "../../../types/cms";
import { resolveImageUrl } from "../../../helpers/media";
import { ArrowDown, ArrowUp, Image as ImgIcon, Trash2, Upload } from "lucide-react";
import Button from "../../ui/Button";

export default function BlockGrid({
  blocks,
  onMove,
  onEdit,
  onReplaceImage,
  onRemoveImage,
  onDelete,
}: {
  blocks: ContentBlock[];
  onMove: (b: ContentBlock, dir: "up" | "down") => void | Promise<void>;
  onEdit: (b: ContentBlock) => void;
  onReplaceImage: (b: ContentBlock, file: File) => void | Promise<void>;
  onRemoveImage: (b: ContentBlock) => void | Promise<void>;
  onDelete: (b: ContentBlock) => void | Promise<void>;
}) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border border-[#C6E3D3] bg-white p-6 text-center text-[#0D784A]/70 shadow-sm">
        Sin bloques.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {blocks.map((b) => {
        const src = resolveImageUrl(b.imagePath) ?? "";
        return (
          <div
            key={b.id}
            className="overflow-hidden rounded-2xl border border-[#C6E3D3] bg-white shadow-sm hover:shadow-md hover:border-[#0D784A]/40 transition-all"
          >
            {/* Imagen */}
            <div className="h-40 w-full bg-[#E6F4EE]/60 grid place-items-center overflow-hidden border-b border-[#C6E3D3]">
              {b.imagePath ? (
                <img src={src} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center text-[#0D784A]/50">
                  <ImgIcon className="h-8 w-8" />
                  <span className="text-xs mt-1">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Texto */}
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-[#0D784A]">{b.title || "(Sin título)"}</div>
                <div className="text-xs text-gray-500">#{b.displayOrder}</div>
              </div>
              {b.body && <p className="text-xs text-gray-600 line-clamp-3">{b.body}</p>}
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t border-[#E6F4EE]">
              <div className="flex gap-1">
                <button
                  onClick={() => onMove(b, "up")}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                  title="Subir"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onMove(b, "down")}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                  title="Bajar"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <label className="inline-flex items-center gap-1 cursor-pointer text-xs text-[#0D784A] hover:underline">
                  <Upload className="h-4 w-4" />
                  Cambiar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onReplaceImage(b, f);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                {b.imagePath && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onRemoveImage(b)}
                    className="!py-1 !px-2 text-xs"
                  >
                    Quitar img
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(b)}
                  className="!py-1 !px-2 text-xs"
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(b)}
                  className="!py-1 !px-2 text-xs"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
