export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  tags: string[] | null;
  isVisible: boolean;
  displayOrder: number;
}

export interface FaqForm {
  question: string;
  answer: string;
  tags: string[];
  isVisible: boolean;
  displayOrder: number;
}

export type CreateFaqDto = Omit<FaqItem, "id">;
export type UpdateFaqDto = Partial<Omit<FaqItem, "id">>;
