// src/hooks/gallery/useImageActions.ts
import type { GalleryImage } from "../../types/gallery";
import { GalleryService } from "../../services/gallery/gallery.service";

export function useImageActions(
  galleryId: number | null,
  images: GalleryImage[],
  setImages: (next: GalleryImage[]) => void,
  reload: () => Promise<void> | void
) {
  async function upload(file: File) {
    if (!galleryId) throw new Error("Seleccione una galería");
    await GalleryService.uploadImage(galleryId, file);
    await reload();
  }

  async function toggleVisible(img: GalleryImage) {
    await GalleryService.updateImageVisibility(img.id, !img.isVisible);
    setImages(images.map((i) => (i.id === img.id ? { ...i, isVisible: !i.isVisible } : i)));
  }

  async function remove(img: GalleryImage) {
    await GalleryService.deleteImage(img.id);
    setImages(images.filter((i) => i.id !== img.id));
  }

  /**
   * Reordena localmente y persiste los elementos cuyo displayOrder cambió.
   * Recibe la lista COMPLETA ya reordenada (no solo la página).
   */
  async function persistOrder(newOrdered: GalleryImage[]) {
    // Normaliza displayOrder secuencial
    const normalized = newOrdered.map((it, idx) => ({ ...it, displayOrder: idx + 1 }));
    setImages(normalized);

    // Persiste solo los que cambian
    const tasks: Promise<unknown>[] = [];
    for (let i = 0; i < normalized.length; i++) {
      const before = images[i];
      const after = normalized[i];
      if (!before || before.id !== after.id || before.displayOrder !== after.displayOrder) {
        tasks.push(GalleryService.updateImageOrder(after.id, after.displayOrder));
      }
    }
    await Promise.all(tasks);
  }

  /**
   * Reordenamiento sencillo por botones ↑/↓ (se mantiene por si lo quieres usar).
   */
  async function move(img: GalleryImage, dir: "up" | "down") {
    const idx = images.findIndex((i) => i.id === img.id);
    if (idx < 0) return;
    const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(images.length - 1, idx + 1);
    if (newIdx === idx) return;

    const reordered = [...images];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, removed);

    await persistOrder(reordered);
  }

  return { upload, toggleVisible, remove, move, persistOrder };
}
