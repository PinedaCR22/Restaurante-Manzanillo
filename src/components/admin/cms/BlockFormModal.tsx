import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { BlockForm } from "../../../types/cms";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass, textAreaClass } from "../../ui/FormField";
import Button from "../../ui/Button";

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
    <ModalBase open={open} title={initial ? "Editar bloque" : "Nuevo bloque"} onClose={onClose} width="600px">
      <div className="max-h-[80vh] overflow-y-auto sm:p-1">
        <FormLayout
          title="Datos del bloque"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title, body, displayOrder, isActive, image, removeImage });
          }}
          onCancel={onClose}
          submitting={saving}
        >
          {/* Imagen */}
          <FormField label="Imagen (opcional)">
            <div className="mb-2 grid h-40 sm:h-48 place-items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" alt="preview" />
              ) : (
                <span className="text-gray-500 text-sm">Sin imagen</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50">
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
                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setRemoveImage(true);
                    setPreview("");
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Quitar imagen
                </Button>
              )}

              <span className="truncate text-sm text-gray-500 max-w-[200px] sm:max-w-none">
                {image ? image.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Título">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Escribe un título…"
              />
            </FormField>

            <FormField label="Orden">
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value || 1))}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Contenido">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={textAreaClass}
              placeholder="Texto descriptivo…"
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-[#0D784A]"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </div>
        </FormLayout>
      </div>
    </ModalBase>
  );
}
