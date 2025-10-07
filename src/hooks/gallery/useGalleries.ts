import { useCallback, useEffect, useState } from "react";
import type { Gallery } from "../../types/gallery";
import { GalleryService } from "../../services/gallery/gallery.service";

export function useGalleries(active?: boolean) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GalleryService.listGalleries(active);
      setGalleries(data);
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { galleries, loading, reload, setGalleries };
}
