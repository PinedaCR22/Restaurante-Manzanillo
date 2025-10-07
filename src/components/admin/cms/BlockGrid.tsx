import type { ContentBlock } from "../../../types/cms";
import { resolveImageUrl } from "../../../helpers/media";
import { ArrowDown, ArrowUp, Image as ImgIcon, Trash2, Upload } from "lucide-react";

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
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        Sin bloques.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {blocks.map((b) => {
        const src = resolveImageUrl(b.imagePath) ?? "";
        return (
          <div key={b.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="h-40 w-full bg-slate-100 grid place-items-center overflow-hidden">
              {b.imagePath ? (
                <img src={src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <ImgIcon className="h-8 w-8" />
                  <div className="text-xs mt-1">Sin imagen</div>
                </div>
              )}
            </div>

            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-900">{b.title || "(Sin título)"}</div>
                <div className="text-xs text-slate-500">#{b.displayOrder}</div>
              </div>
              {b.body && <p className="text-xs text-slate-600 line-clamp-3">{b.body}</p>}
            </div>

            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onMove(b, "up")}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  title="Subir"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onMove(b, "down")}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
                  title="Bajar"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  <span>Cambiar img</span>
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
                  <button
                    onClick={() => onRemoveImage(b)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Quitar img
                  </button>
                )}

                <button
                  onClick={() => onEdit(b)}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(b)}
                  className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50"
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
