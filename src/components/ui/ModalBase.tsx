import React from "react";
import { X } from "lucide-react";

type ModalBaseProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string; // por defecto 500px
};

export default function ModalBase({
  open,
  title,
  onClose,
  children,
  width = "500px",
}: ModalBaseProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative animate-fadeIn"
        style={{ width }}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#0D784A]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
