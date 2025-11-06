// src/hooks/public/useReservation.ts
import { useContext } from "react";
import { ReservationContext } from "./reservation.context";

export const useReservation = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation must be used inside ReservationProvider");
  return ctx;
};
