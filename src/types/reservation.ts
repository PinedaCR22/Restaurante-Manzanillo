// types/reservation.ts
export interface TimeSlot {
  time: string;
  available: boolean;
  id: string;
}

export type TableLocation = "terraza" | "interior" | "privada" | "bar";

export interface TableInfo {
  id: number;
  seats: number;
  available: boolean;
  location?: TableLocation;
}

export type StepTitle = "Fecha y Hora" | "Mesa" | "Datos" | "Confirmación";

export interface ReservationStep {
  step: number;
  title: StepTitle;
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

/* ---------- API types (backend) ---------- */
export type ISODateString = string;

export interface ApiTimeSlot {
  id: string;
  time: string;
  available: boolean;
  date: ISODateString;
}

export interface ApiTable {
  id: number;
  capacity: number; // se mapea a TableInfo.seats en el front
  available: boolean;
  location: TableLocation | string; // si el backend devuelve string libre, lo normalizamos
}

export interface ReservationRequest {
  date: ISODateString;
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
  status: "confirmed" | "pending" | "cancelled";
  date: ISODateString;
  time: string;
  guests: number;
  customerName: string;
  customerEmail: string;
}
