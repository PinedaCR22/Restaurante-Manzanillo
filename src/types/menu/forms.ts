export interface CategoryForm {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface DishForm {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface DishEditorForm {
  categoryId: number | "";
  name: string;
  description: string;
  price: number | string;
  displayOrder?: number;
  isActive: boolean | 0 | 1;
}
