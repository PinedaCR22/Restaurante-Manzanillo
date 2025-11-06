import type { CoopActivityBlock } from "./CoopActivityBlock";

export interface CoopActivity {
  id: number;
  title: string;
  description: string | null;
  include_text: string | null;
  instructions_text: string | null;
  image_path: string | null;
  is_active: number;
  start_at?: string | null;
  end_at?: string | null;
  location?: string | null;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;

  /** ✅ Bloques internos */
  blocks?: CoopActivityBlock[];
}

export type CoopActivityInput = Omit<
  CoopActivity,
  "id" | "created_at" | "updated_at" | "blocks"
>;
