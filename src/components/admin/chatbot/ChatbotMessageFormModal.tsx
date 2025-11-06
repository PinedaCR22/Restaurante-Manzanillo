// src/components/admin/chatbot/ChatbotMessageFormModal.tsx

import { useEffect, useState } from "react";
import ModalBase from "../../ui/ModalBase";
import FormLayout from "../../ui/FormLayout";
import FormField, { inputClass, textAreaClass, selectClass } from "../../ui/FormField";
import type { ChatbotMessage, ChatbotMessageForm } from "../../../types/chatbot/chatbot";

type Props = {
  open: boolean;
  saving?: boolean;
  initial?: Partial<ChatbotMessage>;
  onSubmit: (payload: ChatbotMessageForm) => Promise<void> | void;
  onClose: () => void;
};

const MESSAGE_KINDS = [
  { value: "saludo", label: "Saludo inicial" },
  { value: "fallback", label: "Fallback (sin respuesta)" },
  { value: "despedida", label: "Despedida" },
  { value: "ayuda", label: "Ayuda" },
  { value: "otro", label: "Otro" },
];

export default function ChatbotMessageFormModal({
  open,
  initial,
  saving,
  onSubmit,
  onClose,
}: Props) {
  const [kind, setKind] = useState(initial?.kind ?? "saludo");
  const [content, setContent] = useState(initial?.content ?? "");
  const [displayOrder, setDisplayOrder] = useState<number>(initial?.displayOrder ?? 1);
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);

  useEffect(() => {
    if (!open) return;
    setKind(initial?.kind ?? "saludo");
    setContent(initial?.content ?? "");
    setDisplayOrder(initial?.displayOrder ?? 1);
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  if (!open) return null;

  return (
    <ModalBase
      open={open}
      title={initial?.id ? "Editar mensaje" : "Nuevo mensaje"}
      onClose={onClose}
      width="600px"
    >
      <div className="max-h-[80vh] overflow-y-auto sm:p-1">
        <FormLayout
          title=""
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ kind, content, displayOrder, isActive });
          }}
          onCancel={onClose}
          submitting={saving}
        >
          {/* Tipo de mensaje */}
          <FormField label="Tipo de mensaje">
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={selectClass}>
              {MESSAGE_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {kind === "saludo" && "Mensaje inicial cuando el usuario abre el chat"}
              {kind === "fallback" && "Cuando el bot no encuentra respuesta a la pregunta"}
              {kind === "despedida" && "Mensaje de cierre de conversación"}
              {kind === "ayuda" && "Instrucciones para usar el chatbot"}
            </p>
          </FormField>

          {/* Contenido */}
          <FormField label="Contenido del mensaje">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={textAreaClass + " min-h-[100px]"}
              placeholder="Escribe el mensaje que verá el usuario..."
              required
            />
          </FormField>

          {/* Orden y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Orden">
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value || 1))}
                className={inputClass}
              />
            </FormField>

            <FormField label="Estado">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 accent-[#0D784A]"
                />
                <span className="text-sm text-[#0D784A] font-medium">
                  {isActive ? "Activo" : "Inactivo"}
                </span>
              </label>
            </FormField>
          </div>
        </FormLayout>
      </div>
    </ModalBase>
  );
}