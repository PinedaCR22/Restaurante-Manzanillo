export interface ContentBlock {
  id: number;
  sectionId: number;
  title: string | null;
  body: string | null;
  imagePath: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface BlockForm {
  title?: string;
  body?: string;
  displayOrder?: number;
  isActive?: boolean;
}
