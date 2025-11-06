// src/components/admin/faq/FaqFormModal.tsx

import { useEffect, useState } from "react";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass, textAreaClass } from "../../ui/FormField";
import type { FaqForm, FaqItem } from "../../../types/faqs/faq";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  saving?: boolean;
  initial?: Partial<FaqItem>;
  onSubmit: (payload: FaqForm) => Promise<void> | void;
  onClose: () => void;
};

export default function FaqFormModal({ open, initial, saving, onSubmit, onClose }: Props) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [displayOrder, setDisplayOrder] = useState<number>(initial?.displayOrder ?? 1);
  const [isVisible, setIsVisible] = useState<boolean>(initial?.isVisible ?? true);

  useEffect(() => {
    if (!open) return;
    setQuestion(initial?.question ?? "");
    setAnswer(initial?.answer ?? "");
    setTags(initial?.tags ?? []);
    setDisplayOrder(initial?.displayOrder ?? 1);
    setIsVisible(initial?.isVisible ?? true);
    setTagInput("");
  }, [open, initial]);

  const handleAddTag = () => {
    const normalized = tagInput.trim().toLowerCase();
    if (normalized && !tags.includes(normalized)) {
      setTags([...tags, normalized]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!open) return null;

  return (
    <ModalBase
      open={open}
      title={initial?.id ? "Editar FAQ" : "Nueva FAQ"}
      onClose={onClose}
      width="700px"
    >
      <div className="max-h-[80vh] overflow-y-auto sm:p-1">
        <FormLayout
          title=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ question, answer, tags, displayOrder, isVisible });
          }}
          onCancel={onClose}
          submitting={saving}
        >
          {/* Pregunta */}
          <FormField label="Pregunta">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={inputClass}
              placeholder="¿Cuál es tu pregunta?"
              required
            />
          </FormField>

          {/* Respuesta */}
          <FormField label="Respuesta">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={textAreaClass + " min-h-[120px]"}
              placeholder="Escribe la respuesta..."
              required
            />
          </FormField>

          {/* Tags */}
          <FormField label="Etiquetas de búsqueda (tags)">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={inputClass}
                  placeholder="Escribe y presiona Enter..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#0D784A] text-white rounded-lg hover:bg-[#0B6A41] transition"
                >
                  Agregar
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F4EE] text-[#0D784A] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-[#0D784A]/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Las etiquetas ayudan al chatbot a encontrar esta FAQ. Ejemplo: reserva, horario,
                ubicación
              </p>
            </div>
          </FormField>

          {/* Orden y Visibilidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Orden de visualización">
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value || 1))}
                className={inputClass}
              />
            </FormField>

            <FormField label="Visible en el sitio">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="h-4 w-4 accent-[#0D784A]"
                />
                <span className="text-sm text-[#0D784A] font-medium">
                  {isVisible ? "Activa" : "Inactiva"}
                </span>
              </label>
            </FormField>
          </div>
        </FormLayout>
      </div>
    </ModalBase>
  );
}