// src/components/admin/cms/BlockCard.tsx
import { useState } from "react";
import type { ContentBlock } from "../../../types/cms";
import { CmsService, fileURL } from "../../../services/cms/cms.service";
import BlockFormModal from "./BlockFormModal";

export default function BlockCard({
  block,
  onChanged,
}: {
  block: ContentBlock;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const imgSrc = block.imagePath ? fileURL(block.imagePath, true) : "";

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50">
      {/* Imagen */}
      <div className="grid place-items-center h-64 rounded-t-2xl bg-emerald-50/60 border-b border-emerald-200">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={block.title ?? "Imagen"}
            className="h-64 w-full object-cover rounded-t-2xl"
            loading="lazy"
          />
        ) : (
          <span className="text-emerald-700/70">Sin imagen</span>
        )}
      </div>

      {/* Texto */}
      <div className="p-5">
        {block.title && <h3 className="mb-2 text-xl font-semibold text-emerald-900">{block.title}</h3>}
        {block.body && <p className="text-emerald-800 leading-relaxed">{block.body}</p>}

        <div className="mt-3 text-sm text-emerald-700/70">Orden: {block.displayOrder}</div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-50"
          >
            Editar
          </button>
          <button
            onClick={async () => {
              if (!confirm("¿Eliminar este bloque?")) return;
              await CmsService.deleteBlock(block.id);
              onChanged();
            }}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Modal editar */}
      <BlockFormModal
        open={open}
        initial={{
          title: block.title ?? "",
          body: block.body ?? "",
          displayOrder: block.displayOrder,
          isActive: !!block.isActive,
          previewUrl: imgSrc,
        }}
        saving={saving}
        onClose={() => setOpen(false)}
        onSubmit={async ({ image, removeImage, ...form }) => {
          try {
            setSaving(true);
            // 1) si pidió eliminar imagen: la borramos primero
            if (removeImage && block.imagePath) {
              await CmsService.deleteBlockImage(block.id);
            }
            // 2) actualizamos texto + (opcional) imagen
            await CmsService.updateBlockWithImage(block.id, form, image ?? undefined);
            setOpen(false);
            onChanged();
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
