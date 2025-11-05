import { useState } from "react";
import type { ContentBlock } from "../../../types/cms";
import { CmsService, fileURL } from "../../../services/cms/cms.service";
import BlockFormModal from "./BlockFormModal";
import Button from "../../ui/Button";

export default function BlockCard({
  block,
  onChanged,
  askConfirm,
}: {
  block: ContentBlock;
  onChanged: () => void;
  askConfirm: (msg: string, onConfirm: () => void) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const imgSrc = block.imagePath ? fileURL(block.imagePath, true) : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#C6E3D3] bg-white shadow-sm hover:shadow-md hover:border-[#0D784A]/40 transition-all duration-200">
      {/* Imagen */}
      <div className="h-64 w-full grid place-items-center overflow-hidden bg-[#E6F4EE]/60 border-b border-[#C6E3D3]">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={block.title ?? "Imagen"}
            className="h-64 w-full object-cover transition-transform duration-200 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-[#0D784A]/60 text-sm">Sin imagen</span>
        )}
      </div>

      {/* Texto */}
      <div className="p-5">
        {block.title && (
          <h3 className="mb-2 text-lg font-semibold text-[#0D784A] break-words">{block.title}</h3>
        )}
        {block.body && (
          <p className="text-gray-700 leading-relaxed text-sm line-clamp-4 break-words">{block.body}</p>
        )}
        <div className="mt-3 text-xs text-gray-500">Orden: {block.displayOrder}</div>

        {/* Acciones */}
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              askConfirm(`¿Eliminar el bloque "${block.title}"?`, async () => {
                await CmsService.deleteBlock(block.id);
                onChanged();
              })
            }
          >
            Eliminar
          </Button>
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
            if (removeImage && block.imagePath) {
              await CmsService.deleteBlockImage(block.id);
            }
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
