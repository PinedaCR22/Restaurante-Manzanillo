// src/pages/admin/AdminGalleryPage.tsx
import { useEffect, useMemo, useState } from "react";
import type { Gallery, GalleryImage } from "../../types/gallery";

import { useGalleries } from "../../hooks/gallery/useGalleries";
import { useGalleryImages } from "../../hooks/gallery/useGalleryImages";
import { useImageActions } from "../../hooks/gallery/useImageActions";

import UploadButton from "../../components/admin/gallery/UploadButton";
import SortableImageGrid from "../../components/admin/gallery/SortableImageGrid";
import ConfirmDialog from "../../components/admin/common/ConfirmDialog";
import Pagination from "../../components/admin/common/Pagination";

export default function AdminGalleryPage() {
  // 1) Cargamos galerías; no mostramos UI para crearlas/gestionarlas
  const { galleries, loading: loadingGals } = useGalleries(true); // solo activas (opcional)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Auto-seleccionar la primera galería disponible
  useEffect(() => {
    if (!selectedId && galleries.length > 0) {
      setSelectedId(galleries[0].id);
    }
  }, [galleries, selectedId]);

  // 2) Imágenes de la galería seleccionada
  const {
    images,
    loading: loadingImgs,
    reload: reloadImgs,
    setImages,
  } = useGalleryImages(selectedId);

  const selected = useMemo<Gallery | null>(
    () => galleries.find((g) => g.id === selectedId) ?? null,
    [galleries, selectedId]
  );

  const imgActions = useImageActions(
    selectedId,
    images,
    (next) => setImages(next),
    reloadImgs
  );

  // 3) Confirm genérico
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message?: string;
    loading?: boolean;
    action?: () => Promise<void>;
  }>({ open: false, title: "" });

  function askConfirm(title: string, message: string, action: () => Promise<void>) {
    setConfirm({ open: true, title, message, action, loading: false });
  }
  async function runConfirm() {
    if (!confirm.action) return;
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await confirm.action();
      setConfirm({ open: false, title: "" });
    } finally {
      // noop
    }
  }
  function onDeleteImage(img: GalleryImage) {
    askConfirm("Eliminar imagen", "Esta acción no se puede deshacer.", async () => {
      await imgActions.remove(img);
    });
  }

  // 4) Paginación
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [selectedId]); // reset al cambiar de galería

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Gestión de Galería</h1>
          <p className="text-slate-600">Administra las imágenes de la galería principal</p>
        </div>

        <UploadButton disabled={!selectedId} loading={false} onFile={imgActions.upload} />
      </div>

      {/* Estado de galerías / selección */}
      {loadingGals ? (
        <div className="py-10 text-center text-slate-500">Cargando…</div>
      ) : !selected ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          No hay una galería activa. Crea/activa una desde el backend si fuese necesario.
        </div>
      ) : (
        <>
        

          {/* Grid / DnD */}
          <div className="min-h-[120px]">
            {loadingImgs ? (
              <div className="py-10 text-center text-slate-500">Cargando…</div>
            ) : (
              <>
                <SortableImageGrid
                  images={images}
                  page={page}
                  pageSize={PAGE_SIZE}
                  onPageReorder={(merged) => imgActions.persistOrder(merged)}
                  onToggle={imgActions.toggleVisible}
                  onDelete={onDeleteImage}
                />

                {/* Paginación “normal” */}
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </>
      )}

      {/* Confirmación */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        loading={confirm.loading}
        onClose={() => setConfirm({ open: false, title: "" })}
        onConfirm={runConfirm}
      />
    </div>
  );
}
