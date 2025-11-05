import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

type SuccessDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  autoCloseMs?: number;
  onClose: () => void;
};

export default function SuccessDialog({
  open,
  title = "Acción completada",
  message = "Operación realizada correctamente.",
  autoCloseMs = 1200, // 🔹 más rápido
  onClose,
}: SuccessDialogProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 animate-fade-in text-center p-6">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 mb-3 animate-pop" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
      </div>

      <style>{`
        @keyframes fade-in { from {opacity: 0;} to {opacity: 1;} }
        @keyframes pop { 0% {transform: scale(0.9);} 100% {transform: scale(1);} }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-pop { animation: pop 0.25s ease-out; }
      `}</style>
    </div>
  );
}
