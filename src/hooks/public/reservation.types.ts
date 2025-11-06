// src/hooks/public/reservation.types.ts
import type { ReservationData, ReservationStep } from "../../types/reservation";

export const MAX_STEP = 4;

export const initialReservationData: ReservationData = {
  date: null,
  time: "",
  peopleCount: 2,
  tableNumber: null,
  customerInfo: {
    fullName: "",
    email: "",
    phone: "",
    note: "",
  },
};

export const initialSteps: ReservationStep[] = [
  { step: 1, title: "Fecha y Hora", completed: false, active: true },
  { step: 2, title: "Mesa", completed: false, active: false },
  { step: 3, title: "Datos", completed: false, active: false },
  { step: 4, title: "Confirmación", completed: false, active: false },
];
