export interface Category {
  id: number;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean | 0 | 1;
  imagePath?: string | null;
}
