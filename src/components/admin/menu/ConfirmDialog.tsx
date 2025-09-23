type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {message && <p className="mt-1 text-slate-600">{message}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            {cancelText}
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-xl border border-red-200 bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-600/90 disabled:opacity-60"
          >
            {loading ? "Procesando…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
