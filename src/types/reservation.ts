// types/reservation.ts
export interface TimeSlot {
  time: string;
  available: boolean;
  id: string;
}

export interface TableInfo {
  id: number;
  seats: number;
  available: boolean;
  location?: string;
}

export interface ReservationStep {
  step: number;
  title: string;
  completed: boolean;
  active: boolean;
}

export interface ReservationData {
  date: Date | null;
  time: string;
  guests: number;
  tableId: number | null;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
  };
}

export interface ReservationContextType {
  currentStep: number;
  reservationData: ReservationData;
  steps: ReservationStep[];
  nextStep: () => void;
  prevStep: () => void;
  updateReservationData: (data: Partial<ReservationData>) => void;
  submitReservation: () => Promise<void>;
  resetReservation: () => void;
}

// API Response types para futuros endpoints
export interface ApiTimeSlot {
  id: string;
  time: string;
  available: boolean;
  date: string;
}

export interface ApiTable {
  id: number;
  capacity: number;
  available: boolean;
  location: string;
}

export interface ReservationRequest {
  date: string;
  time: string;
  guests: number;
  tableId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

export interface ReservationResponse {
  id: string;
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  date: string;
  time: string;
  guests: number;
  customerName: string;
  customerEmail: string;
}