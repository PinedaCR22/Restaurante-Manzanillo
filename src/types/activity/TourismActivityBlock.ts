export interface TourismActivityBlock {
  id?: number;
  tourism_activity_id?: number;
  title?: string | null;
  body?: string | null;
  image_path?: string | null;
  display_order?: number;
  is_active?: number;
}
