import Modal from "./Modal";
import UploadTile from "./UploadTile";

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
    <Modal open={open} onClose={onClose} title={mode === "create" ? "Nueva categoría" : "Editar categoría"}>
      <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
            placeholder="Ej: Entradas"
          />
          {invalidName && <p className="mt-1 text-xs text-red-600">Nombre requerido</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 outline-none
                       focus:ring-2 focus:ring-[#0D784A]/30 focus:border-[#0D784A]"
            placeholder="Opcional…"
          />
        </div>

        <UploadTile
          file={imageFile}
          setFile={setImageFile}
          currentUrl={currentImageUrl}
          onRemoveCurrent={onRemoveImage}
          label="Portada"
        />

        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || invalidName}
            className="rounded-lg bg-[#0D784A] hover:bg-[#0B6A41] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
