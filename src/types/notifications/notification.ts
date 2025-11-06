import type { RestaurantReservation } from "../restaurant-reservations/RestaurantReservation";

export interface ActivityContactForm {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  activityName?: string;
  createdAt?: string;
}

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
  restaurantReservation?: RestaurantReservation;
  activityContactForm?: ActivityContactForm;
}