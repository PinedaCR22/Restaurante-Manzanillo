import { useCallback, useEffect, useMemo, useState } from "react";
import type { Gallery, GalleryImage } from "../../types/gallery";
import { GalleryPublicService } from "../../services/public/gallery-public.service";

type Result = {
  gallery: Gallery | null;
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Si pasas galleryId -> usa esa galería.
 * Si NO pasas galleryId -> toma la primera activa.
 */
export function usePublicGallery(galleryId?: number): Result {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let id = galleryId;
      if (!id) {
        const gals = await GalleryPublicService.listActiveGalleries();
        id = gals[0]?.id;
        setGallery(gals[0] ?? null);
      }
      if (id) {
        const g = await GalleryPublicService.getPublicGallery(id);
        setGallery({ id: g.id, title: g.title, layout: g.layout, description: undefined, isActive: true });
        setImages((g.images ?? []).sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setGallery(null);
        setImages([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return useMemo(() => ({ gallery, images, loading, error, reload }), [gallery, images, loading, error, reload]);
}
