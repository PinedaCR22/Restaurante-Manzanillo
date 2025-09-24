import { useToast } from "../.././hooks/useToast";
import type { ToastItem } from "../.././hooks/toast-context";

export default function ToastViewport() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex w-[320px] flex-col gap-2">
      {toasts.map((t: ToastItem) => (
        <div
          key={t.id}
          className={[
            "rounded-xl border p-3 shadow-lg backdrop-blur",
            t.type === "success" && "border-emerald-200 bg-emerald-50",
            t.type === "error" && "border-red-200 bg-red-50",
            t.type === "info" && "border-slate-200 bg-white/80",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium text-slate-900">{t.title}</div>
              {t.message && <div className="text-sm text-slate-600">{t.message}</div>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
