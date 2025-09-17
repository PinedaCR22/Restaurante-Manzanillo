export interface Dish {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  price: number | string;
  displayOrder: number;
  isActive: boolean | 0 | 1;
}
