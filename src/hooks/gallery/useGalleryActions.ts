import type { Gallery } from "../../types/gallery";
import { GalleryService } from "../../services/gallery/gallery.service";

export function useGalleryActions(reload: () => Promise<void> | void) {
  async function toggleActive(g: Gallery) {
    await GalleryService.updateGalleryVisibility(g.id, !g.isActive);
    await reload();
  }

  async function removeGallery(id: number) {
    await GalleryService.deleteGallery(id);
    await reload();
  }

  return { toggleActive, removeGallery };
}
