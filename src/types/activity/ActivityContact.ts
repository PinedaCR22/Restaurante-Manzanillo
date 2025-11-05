export interface ActivityContact {
  id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  created_at: string;
}
