"use client";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import type { TourismActivity } from "../../../types/activity/TourismActivity";
import type { TourismActivityBlock } from "../../../types/activity/TourismActivityBlock";
import { tourismActivityBlockService } from "../../../services/activity/tourismActivityBlockService";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useSuccessDialog } from "../../../hooks/useSuccessDialog";
import { API_URL } from "../../../lib/config";

interface Props {
  activity: TourismActivity;
}

type EditableBlock = TourismActivityBlock & {
  _isNew?: boolean;
  _isEditing?: boolean;
  _file?: File | null;
};

export function TourismActivityBlocksForm({ activity }: Props) {
  const [blocks, setBlocks] = useState<EditableBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm?: () => void }>(
    {
    open: false,
    message: "",
  });
  const { show, Dialog } = useSuccessDialog();

  const loadBlocks = useCallback(async (): Promise<void> => {
    const data = await tourismActivityBlockService.list(activity.id);
    setBlocks(data.map((b) => ({ ...b, _isEditing: false, _file: null })));
  }, [activity.id]);

  useEffect(() => {
    void loadBlocks();
  }, [loadBlocks]);

  const handleChange = <K extends keyof EditableBlock>(
    index: number,
    key: K,
    value: EditableBlock[K]
  ): void => {
    setBlocks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const handleImageFile = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    handleChange(index, "_file", file);
  };

  const askConfirm = (message: string, onConfirm: () => void) =>
    setConfirm({ open: true, message, onConfirm });

  const handleConfirm = () => {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ open: false, message: "" });
  };

  const addNew = (): void => {
    setBlocks((prev) => [
      ...prev,
      {
        title: "",
        body: "",
        image_path: "",
        display_order: (prev.length || 0) + 1,
        is_active: 1,
        _isNew: true,
        _isEditing: true,
        _file: null,
      },
    ]);
  };

  const cancelEdit = (index: number): void => {
    setBlocks((prev) => {
      const copy = [...prev];
      const b = copy[index];
      if (b._isNew) {
        return copy.filter((_, i) => i !== index);
      }
      copy[index] = { ...b, _isEditing: false, _file: null };
      return copy;
    });
  };

  const remove = async (block: EditableBlock, idx: number): Promise<void> => {
    askConfirm("¿Eliminar este bloque?", async () => {
      if (block.id) await tourismActivityBlockService.remove(block.id);
      setBlocks((prev) => prev.filter((_, i) => i !== idx));
      show("Operación exitosa", "Bloque eliminado correctamente");
    });
  };

  const saveOne = async (idx: number): Promise<void> => {
    const b = blocks[idx];
    setSaving(true);
    try {
      const payload: TourismActivityBlock = {
        title: b.title ?? "",
        body: b.body ?? "",
        image_path: b.image_path ?? "",
        display_order: b.display_order ?? idx + 1,
        is_active: b.is_active ?? 1,
      };

      let blockId = b.id;
      if (b.id) await tourismActivityBlockService.update(b.id, payload);
      else {
        const created = await tourismActivityBlockService.create(activity.id, payload);
        blockId = created.id;
      }

      if (b._file && blockId)
        await tourismActivityBlockService.uploadImage(blockId, b._file);

      await loadBlocks();
      show("Operación exitosa", "Los cambios se guardaron correctamente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 text-gray-800">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h4 className="text-2xl font-semibold tracking-wide">Bloques / Secciones</h4>
        <Button onClick={addNew} className="text-base px-5 py-2">
          + Agregar bloque
        </Button>
      </div>

      {blocks.map((b, i) => {
        const isEditing = b._isEditing || b._isNew;

        return (
          <div
            key={b.id ?? `new-${i}`}
            className="rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-stretch">
              <div className="relative w-full md:w-2/5 aspect-[16/9] md:aspect-auto">
                {isEditing ? (
                  <>
                    <input
                      id={`file-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFile(i, e)}
                      className="hidden"
                    />
                    <label htmlFor={`file-${i}`} className="cursor-pointer block w-full h-full">
                      {b._file ? (
                        <img
                          src={URL.createObjectURL(b._file)}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                      ) : b.image_path ? (
                        <img
  src={
    b.image_path?.startsWith("http")
      ? b.image_path
      : `${API_URL}${b.image_path}`
  }
  alt={b.title ?? "block"}
  className="object-cover w-full h-full"
/>
                      ) : (
                        <div className="flex justify-center items-center h-full bg-gray-100 text-gray-500">
                          Haz clic para subir imagen
                        </div>
                      )}
                    </label>
                  </>
                ) : (
                  <img
  src={
    b.image_path
      ? b.image_path.startsWith("http")
        ? b.image_path
        : `${API_URL}${b.image_path}`
      : "/placeholder.jpg"
  }
  alt={b.title ?? "block"}
  className="object-cover w-full h-full"
/>

                )}
              </div>

              <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                <p className="text-xs text-emerald-700 mb-2">
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={b.title ?? ""}
                      onChange={(e) => handleChange(i, "title", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#0D784A]"
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={b.body ?? ""}
                      onChange={(e) => handleChange(i, "body", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0D784A] resize-y min-h-[140px] md:min-h-[180px]"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleChange(i, "_isEditing", true)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void remove(b, i)}
                      >
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => void saveOne(i)}
                        disabled={saving}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => cancelEdit(i)}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {!blocks.length && (
        <p className="text-center text-gray-500 text-base">
          No hay bloques registrados. Usa “+ Agregar bloque”.
        </p>
      )}

      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onCancel={() => setConfirm({ open: false, message: "" })}
        onConfirm={handleConfirm}
      />
      <Dialog />
    </div>
  );
}
