export interface PageSection {
  id: number;
  sectionKey: string;
  panelTitle: string | null;
  isVisible: boolean;
}

export interface SectionForm {
  sectionKey: string;
  panelTitle?: string;
  isVisible?: boolean;
}
