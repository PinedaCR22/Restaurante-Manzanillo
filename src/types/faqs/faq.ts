// src/types/faq/faq.ts

/**
 * Entidad FAQ completa desde la BD
 */
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  tags: string[] | null;
  isVisible: boolean;
  displayOrder: number;
}

/**
 * Formulario para crear/editar FAQ
 */
export interface FaqForm {
  question: string;
  answer: string;
  tags: string[];
  isVisible: boolean;
  displayOrder: number;
}

/**
 * DTO para crear FAQ (sin id)
 */
export type CreateFaqDto = Omit<FaqItem, "id">;

/**
 * DTO para actualizar FAQ (campos opcionales)
 */
export type UpdateFaqDto = Partial<Omit<FaqItem, "id">>;