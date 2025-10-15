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
    <div className="rounded-xl border border-emerald-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Info principal */}
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 text-xs text-emerald-800">
              <meta.Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </div>
          {item.value && (
            <div className="truncate text-emerald-800/90">{item.value}</div>
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-emerald-800/80">Orden</label>
            <input
              type="number"
              min={1}
              value={item.displayOrder}
              onChange={(e) =>
                onChangeOrder(item.id, Number(e.target.value || 1))
              }
              className="w-20 rounded-lg border border-emerald-300 px-2 py-1 text-sm"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!item.isActive}
              onChange={(e) => onToggleActive(item.id, e.target.checked)}
            />
            <span className="text-sm text-emerald-800">Activo</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
