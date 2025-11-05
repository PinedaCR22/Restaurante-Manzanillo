import ModalBase from "../../ui/ModalBase";
import FormField, { inputClass, textAreaClass } from "../../ui/FormField";
import UploadTile from "./UploadTile";
import Button from "../../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  name: string;
  description: string;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  currentImageUrl: string | null;
  onRemoveImage?: () => void;
  onSubmit: () => Promise<void> | void;
  loading?: boolean;
  mode?: "create" | "edit";
};

export default function CategoryModal({
  open,
  onClose,
  name,
  description,
  setName,
  setDescription,
  imageFile,
  setImageFile,
  currentImageUrl,
  onRemoveImage,
  onSubmit,
  loading = false,
  mode = "create",
}: Props) {
  const invalidName = !name.trim();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (invalidName) return;
    await onSubmit();
  }

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Nueva categoría" : "Editar categoría"}
    >
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto p-2"
      >
        <FormField label="Nombre">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Ej: Entradas"
            required
          />
          {invalidName && (
            <p className="text-xs text-red-600 mt-1">Nombre requerido</p>
          )}
        </FormField>

        <FormField label="Descripción (opcional)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={textAreaClass}
            rows={3}
            placeholder="Ej: Entradas frías, calientes o compartidas"
          />
        </FormField>

        <UploadTile
          file={imageFile}
          setFile={setImageFile}
          currentUrl={currentImageUrl}
          onRemoveCurrent={onRemoveImage}
          label="Portada de categoría"
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || invalidName}
            isLoading={loading}
          >
            Guardar categoría
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}
