type Props = {
  file: File | null;
  setFile: (f: File | null) => void;
  currentUrl?: string | null;
  onRemoveCurrent?: () => void;
  label?: string;
};

export default function UploadTile({
  file,
  setFile,
  currentUrl,
  onRemoveCurrent,
  label = "Portada",
}: Props) {
  const preview = file ? URL.createObjectURL(file) : currentUrl || null;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>

      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
          {preview ? (
            <img src={preview} className="h-full w-full object-cover" alt="preview" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            id="image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFile(f);
            }}
          />
          <div className="flex gap-2">
            <label
              htmlFor="image-input"
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Seleccionar archivo
            </label>

            {preview && (
              <button
                type="button"
                onClick={() => {
                  if (file) setFile(null);
                  else onRemoveCurrent?.();
                }}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              >
                Quitar
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">JPG o PNG. Máx ~2–5MB.</p>
        </div>
      </div>
    </div>
  );
}
