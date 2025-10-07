import { Upload } from "lucide-react";

export default function UploadButton({
  disabled,
  loading,
  onFile,
  maxSizeMB = 5, // 👈 nuevo
}: {
  disabled?: boolean;
  loading?: boolean;
  onFile: (file: File) => void | Promise<void>;
  maxSizeMB?: number;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
      <Upload className="h-4 w-4" />
      <span>{loading ? "Subiendo…" : "Subir imagen"}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            if (f.size > maxSizeMB * 1024 * 1024) {
              alert(`La imagen no debe superar ${maxSizeMB} MB`);
            } else {
              void onFile(f);
            }
          }
          e.currentTarget.value = "";
        }}
      />
    </label>
  );
}
