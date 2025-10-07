// src/components/admin/cms/BlockFormModal.tsx
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { BlockForm } from "../../../types/cms";

type Props = {
  open: boolean;
  saving?: boolean;
  initial?: Partial<BlockForm> & { previewUrl?: string };
  onSubmit: (payload: BlockForm & { image?: File | null; removeImage?: boolean }) => Promise<void> | void;
  onClose: () => void;
};

export default function BlockFormModal({ open, initial, saving, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [displayOrder, setDisplayOrder] = useState<number>(initial?.displayOrder ?? 1);
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);

  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [preview, setPreview] = useState<string>(initial?.previewUrl ?? "");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const revokeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setBody(initial?.body ?? "");
    setDisplayOrder(initial?.displayOrder ?? 1);
    setIsActive(initial?.isActive ?? true);
    setPreview(initial?.previewUrl ?? "");
    setImage(null);
    setRemoveImage(false);
    if (inputRef.current) inputRef.current.value = "";
  }, [open, initial]);

  // Revocar URLs temporales cuando cambie el archivo o se desmonte
  useEffect(() => {
    return () => {
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    };
  }, []);

  if (!open) return null;

  function handlePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setRemoveImage(false);

    // limpia URL anterior
    if (revokeRef.current) {
      URL.revokeObjectURL(revokeRef.current);
      revokeRef.current = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      revokeRef.current = url;
      setPreview(url);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/35 p-4">
      {/* Modal: máx 85vh y layout en columnas para tener header/body/footer */}
      <div className="flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shadow-[0_1px_0_rgba(16,185,129,0.12)]">
          <h3 className="text-base font-semibold text-emerald-900">
            {initial ? "Editar bloque" : "Nuevo bloque"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-emerald-800 hover:bg-emerald-50"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body con scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Imagen */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-emerald-800">
              Imagen (opcional)
            </label>

            <div className="mb-2 grid h-48 place-items-center overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" alt="preview" />
              ) : (
                <span className="text-emerald-700/70">Sin imagen</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* input file oculto + botón estilizado */}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePick}
                  className="sr-only"
                />
                Seleccionar archivo
              </label>

              {preview && !image && (
                <button
                  type="button"
                  onClick={() => {
                    setRemoveImage(true);
                    setPreview("");
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  Quitar imagen
                </button>
              )}

              <span className="truncate text-sm text-emerald-700/70">
                {image ? image.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-emerald-800">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Escribe un título…"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-emerald-800">Contenido</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[7rem] w-full resize-y rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Texto descriptivo…"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-emerald-800">Orden</label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value || 1))}
                className="w-full rounded-lg border border-emerald-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <label className="mt-6 inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              <span className="text-sm text-emerald-800">Activo</span>
            </label>
          </div>
        </div>

        {/* Footer sticky (siempre visible) */}
        <div className="flex items-center justify-between px-5 py-3 shadow-[0_1px_0_rgba(16,185,129,0.12)]">
          <button
            onClick={onClose}
            className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-50"
          >
            Cancelar
          </button>
          <button
            disabled={!!saving}
            onClick={() => onSubmit({ title, body, displayOrder, isActive, image, removeImage })}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600/90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
