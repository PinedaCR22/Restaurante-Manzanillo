export interface Notification {
  id: number;
  category: string;
  title: string;
  message: string;
  status: 'new' | 'read';
  type: 'EMAIL' | 'PUSH' | 'SYSTEM';
  createdAt: string;
  user?: {
    id: number;
    email: string;
  };
  restaurantReservation?: {
    id: number;
  };
}
