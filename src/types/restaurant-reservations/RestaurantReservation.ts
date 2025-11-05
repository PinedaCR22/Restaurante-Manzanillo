export interface RestaurantReservation {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  peopleCount: number;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmedBy?: number | null;
  zone?: string;
  tableNumber?: number;
  createdAt: string;
  confirmedUser?: {
    id: number;
    firstName: string;
    lastName: string;
    role?: { id: number; name: string };
  } | null;
}
