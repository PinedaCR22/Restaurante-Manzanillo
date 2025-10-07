export type GalleryLayout = "grid" | "carousel" | "mosaic";

export interface Gallery {
  id: number;
  title: string;
  description?: string | null;
  layout: GalleryLayout;
  isActive: boolean;
}
