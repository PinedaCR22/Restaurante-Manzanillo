import { useMemo } from "react";
import type { ContactItem } from "../../../types/contact/contact";
import {
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin,
  Instagram,
  Facebook,
  Music2 as Tiktok,
  MessageCircle as WhatsApp,
  Link as LinkIcon,
  Pencil,
  Trash2,
} from "lucide-react";

type Props = {
  item: ContactItem;
  onEdit: (item: ContactItem) => void;
  onDelete: (id: number) => void;
  onChangeOrder: (id: number, order: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
};

export default function ContactRow({
  item,
  onEdit,
  onDelete,
  onChangeOrder,
  onToggleActive,
}: Props) {
  const meta = useMemo(() => {
    const k = (item.kind || "").toLowerCase();
    if (k === "phone") return { label: "Teléfono", Icon: PhoneIcon };
    if (k === "email") return { label: "Correo", Icon: MailIcon };
    if (k === "address") return { label: "Dirección", Icon: MapPin };
    if (k === "instagram") return { label: "Instagram", Icon: Instagram };
    if (k === "facebook") return { label: "Facebook", Icon: Facebook };
    if (k === "tiktok") return { label: "TikTok", Icon: Tiktok };
    if (k === "whatsapp") return { label: "WhatsApp", Icon: WhatsApp };
    return { label: "Otro", Icon: LinkIcon };
  }, [item.kind]);

  return (
    <div className="rounded-xl border border-[#C6E3D3] bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Info principal */}
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C6E3D3] px-2 py-0.5 text-xs text-[#0D784A]">
              <meta.Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </div>
          {item.value && (
            <div className="truncate text-[#0D784A]/90 font-medium">
              {item.value}
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#0D784A]/80">Orden</label>
            <input
              type="number"
              min={1}
              value={item.displayOrder}
              onChange={(e) =>
                onChangeOrder(item.id, Number(e.target.value || 1))
              }
              className="w-20 rounded-lg border border-[#C6E3D3] px-2 py-1 text-sm"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!item.isActive}
              onChange={(e) => onToggleActive(item.id, e.target.checked)}
            />
            <span className="text-sm text-[#0D784A]">Activo</span>
          </label>

          {/* Botones con estilo independiente */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0D784A] text-[#0D784A] px-3 py-1.5 text-sm font-medium hover:bg-[#E6F4EE] transition"
            >
              <Pencil size={16} />
              Editar
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E53935] text-white px-3 py-1.5 text-sm font-medium hover:bg-[#C62828] transition"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
