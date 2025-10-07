import type { GalleryLayout } from "./gallery";

export interface GalleryForm {
  title: string;
  description?: string;
  layout: GalleryLayout;
  isActive: boolean;
}
