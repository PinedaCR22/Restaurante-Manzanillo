import { useEffect, useState } from "react";


import { useGalleryImages } from "../../hooks/gallery/useGalleryImages";
import { useImageActions } from "../../hooks/gallery/useImageActions";

import UploadButton from "../../components/admin/gallery/UploadButton";
import SortableImageGrid from "../../components/admin/gallery/SortableImageGrid";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import Pagination from "../../components/ui/Pagination";

export default function AdminGalleryPage() {
  // ===========================
  // 🖼️ Galería principal (única)
  // ===========================
  const MAIN_GALLERY_ID = 1; // ID fijo o configurado
  const {
    images,
    loading: loadingImgs,
    reload: reloadImgs,
    setImages,
  } = useGalleryImages(MAIN_GALLERY_ID);

  const imgActions = useImageActions(
    MAIN_GALLERY_ID,
    images,
    (next) => setImages(next),
    reloadImgs
  );

  // ===========================
  // ⚙️ Confirmaciones
  // ===========================
  const [confirm, setConfirm] = useState<{
    open: boolean;
    message: string;
    onConfirm?: () => Promise<void> | void;
  }>({ open: false, message: "" });

  function askConfirm(message: string, onConfirm: () => Promise<void> | void) {
    setConfirm({ open: true, message, onConfirm });
  }

  function handleConfirm() {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ open: false, message: "" });
  }

  // ===========================
  // 📄 Paginación
  // ===========================
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [images]);
  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));

  // ===========================
  // 🎨 Render principal
  // ===========================
  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* 🔹 Encabezado principal */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D784A]">Galería del Sitio</h1>
        <UploadButton
          disabled={loadingImgs}
          loading={false}
          onFile={imgActions.upload}
        />
      </div>

      {/* 🔹 Tarjetas resumen (idénticas a Reservas) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#E6F4EE] border border-[#C6E3D3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Imágenes totales</h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
            {images.length}
          </p>
        </div>
        <div className="bg-[#E9F8EF] border border-[#B7E4C3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Visibles</h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
            {images.filter((img) => img.isVisible).length}
          </p>
        </div>
        <div className="bg-[#FDECEC] border border-[#F5C2C2] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Ocultas</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-1">
            {images.filter((img) => !img.isVisible).length}
          </p>
        </div>
      </div>

      {/* 🔹 Grid de imágenes */}
      <div className="min-h-[120px]">
        {loadingImgs ? (
          <p className="text-center text-gray-500 py-6">Cargando imágenes…</p>
        ) : (
          <>
            <SortableImageGrid
              images={images}
              page={page}
              pageSize={PAGE_SIZE}
              onPageReorder={(merged) => imgActions.persistOrder(merged)}
              onToggle={imgActions.toggleVisible}
              onDelete={(img) =>
                askConfirm("¿Eliminar esta imagen?", async () => {
                  await imgActions.remove(img);
                })
              }
            />

            {/* 🔹 Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination page={page} total={totalPages} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* 🔹 Confirmación global */}
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onCancel={() => setConfirm({ open: false, message: "" })}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
