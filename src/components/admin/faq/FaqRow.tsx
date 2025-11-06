// src/components/admin/faq/FaqRow.tsx

import type { FaqItem } from "../../../types/faqs/faq";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Props = {
  item: FaqItem;
  onEdit: (item: FaqItem) => void;
  onDelete: (id: number) => void;
  onChangeOrder: (id: number, order: number) => void;
  onToggleVisible: (id: number, isVisible: boolean) => void;
};

export default function FaqRow({
  item,
  onEdit,
  onDelete,
  onChangeOrder,
  onToggleVisible,
}: Props) {
  const tags = Array.isArray(item.tags) ? item.tags : [];

  return (
    <div className="rounded-xl border border-[#C6E3D3] bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-3">
        {/* Pregunta */}
        <div>
          <h3 className="font-semibold text-[#0D784A] text-lg mb-1">{item.question}</h3>
          <p className="text-sm text-gray-700 line-clamp-2">{item.answer}</p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 6).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#E6F4EE] text-[#0D784A] rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {tags.length > 6 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{tags.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Controles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Orden</label>
              <input
                type="number"
                min={1}
                value={item.displayOrder}
                onChange={(e) => onChangeOrder(item.id, Number(e.target.value || 1))}
                className="w-20 rounded-lg border border-[#C6E3D3] px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={() => onToggleVisible(item.id, !item.isVisible)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                item.isVisible
                  ? "bg-[#E6F4EE] text-[#0D784A] hover:bg-[#D0E8DD]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              {item.isVisible ? "Visible" : "Oculta"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0D784A] text-[#0D784A] px-3 py-1.5 text-sm font-medium hover:bg-[#E6F4EE] transition"
            >
              <Pencil size={14} />
              Editar
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-700 transition"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}