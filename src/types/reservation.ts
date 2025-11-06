// src/types/reservation.ts

/* -----------------------------------
   Slots de horario
----------------------------------- */
export interface TimeSlot {
  time: string;
  available: boolean;
  id: string;
}

/* -----------------------------------
   Ubicaciones del restaurante
----------------------------------- */
export type TableLocation = "terraza" | "interior" | "privada" | "bar";

/* -----------------------------------
   Información de mesas
----------------------------------- */
export interface TableInfo {
  id: number;
  seats: number;
  available: boolean;
  location: TableLocation;
}

/* -----------------------------------
   Pasos de la reserva
----------------------------------- */
export type StepTitle = "Fecha y Hora" | "Mesa" | "Datos" | "Confirmación";

export interface ReservationStep {
  step: number;
  title: StepTitle;
  completed: boolean;
  active: boolean;
}

/* -----------------------------------
   Datos de reserva usados por el FRONT
----------------------------------- */
export interface ReservationData {
  date: Date | null;        // Fecha seleccionada (objeto Date)
  time: string;             // "14:30"
  peopleCount: number;      // ✅ renombrado según backend
  tableNumber: number | null; // ✅ renombrado según backend

  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    note: string;           // ✅ renombrado según backend
  };
}

/* -----------------------------------
   Context para el proveedor
----------------------------------- */
export interface ReservationContextType {
  currentStep: number;
  reservationData: ReservationData;
  steps: ReservationStep[];

  nextStep: () => void;
  prevStep: () => void;
  updateReservationData: (data: Partial<ReservationData>) => void;

  submitReservation: () => Promise<ReservationResponse | null>;
  resetReservation: () => void;
}

/* -----------------------------------
   API types (BACKEND)
----------------------------------- */
export type ISODateString = string;

/* Horarios disponibles */
export interface ApiTimeSlot {
  id: string;
  time: string;
  available: boolean;
  date: ISODateString;
}

/* Mesas disponibles */
export interface ApiTable {
  id: number;
  capacity: number;     // backend envía "capacity"
  available: boolean;
  location: string;     // backend puede enviar string libre → se normaliza
}

/* Payload que ENVÍA el front hacia el backend */
export interface ReservationRequest {
  customerName: string;
  phone?: string;
  email?: string;

  date: ISODateString;  // "2025-10-18"
  time: string;         // "14:30"

  peopleCount: number;  // ✅ backend usa peopleCount
  tableNumber?: number; // ✅ backend usa tableNumber
  note?: string;        // ✅ backend usa note

  zone?: string;        // opcional
}

/* Respuesta del backend */
export interface ReservationResponse {
  id: string;
  confirmationNumber: string;
  status: "pending" | "confirmed" | "cancelled";

  date: ISODateString;
  time: string;

  peopleCount: number;
  customerName: string;
  email?: string;
}
