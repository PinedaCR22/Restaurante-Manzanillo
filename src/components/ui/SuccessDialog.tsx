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
  title = "Guardado con éxito",
  message = "La acción se realizó correctamente.",
  autoCloseMs = 2000,
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 animate-slideUp text-center p-6">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
      </div>

      {/* animaciones */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
