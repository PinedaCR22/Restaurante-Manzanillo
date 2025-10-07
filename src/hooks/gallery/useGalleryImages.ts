import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "../../types/gallery";
import { GalleryService } from "../../services/gallery/gallery.service";

export function useGalleryImages(galleryId: number | null) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const reload = useCallback(async () => {
    if (!galleryId) {
      setImages([]);
      return;
    }
    setLoading(true);
    try {
      const data = await GalleryService.listImages(galleryId);
      setImages(data);
    } finally {
      setLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { images, setImages, loading, reload };
}
