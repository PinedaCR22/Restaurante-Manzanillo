import type { TourismActivityBlock } from "./TourismActivityBlock";

export interface TourismActivity {
  id: number;
  title: string;
  description: string | null;
  include_schedule_text: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_note: string | null;
  image_path: string | null;
  is_active: number;
  start_at?: string | null;
  end_at?: string | null;
  location?: string | null;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;

  /** ✅ Bloques internos */
  blocks?: TourismActivityBlock[];
}

export type TourismActivityInput = Omit<
  TourismActivity,
  "id" | "created_at" | "updated_at" | "blocks"
>;
