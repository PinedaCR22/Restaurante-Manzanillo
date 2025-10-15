export type ContactKind =
  | "phone"
  | "email"
  | "address"
  | "instagram"
  | "facebook"
  | "tiktok"
  | string; // admite valores personalizados como "whatsapp", "x", etc.

export interface ContactItem {
  id: number;
  kind: ContactKind;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ContactForm {
  kind: ContactKind;
  value: string;
  displayOrder?: number;
  isActive?: boolean;
}
