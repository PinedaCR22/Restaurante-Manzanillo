// src/hooks/public/reservation.context.ts
import { createContext } from "react";
import type { ReservationContextType } from "../../types/reservation";

export const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);
