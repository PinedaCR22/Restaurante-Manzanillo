import { X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  loading = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {message && <p className="mb-4 text-sm text-slate-600">{message}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700/90 disabled:opacity-60"
          >
            {loading ? "Procesando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
