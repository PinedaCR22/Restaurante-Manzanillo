// src/hooks/public/reservation.provider.tsx
import { useReducer, type ReactNode } from "react";
import { ReservationContext } from "./reservation.context";
import { createReservation } from "../../services/public/reservationsPublic.service";

import type {
  ReservationContextType,
  ReservationData,
  ReservationRequest,
  ReservationResponse,
} from "../../types/reservation";

import {
  MAX_STEP,
  initialReservationData,
  initialSteps,
} from "./reservation.types";

interface ReservationState {
  currentStep: number;
  reservationData: ReservationData;
  steps: typeof initialSteps;
  isLoading: boolean;
}

type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "UPDATE_DATA"; payload: Partial<ReservationData> }
  | { type: "RESET" }
  | { type: "SET_LOADING"; payload: boolean };

const reservationReducer = (
  state: ReservationState,
  action: Action
): ReservationState => {
  switch (action.type) {
    case "NEXT_STEP": {
      const next = Math.min(state.currentStep + 1, MAX_STEP);
      return {
        ...state,
        currentStep: next,
        steps: state.steps.map((s) => ({
          ...s,
          completed: s.step < next,
          active: s.step === next,
        })),
      };
    }

    case "PREV_STEP": {
      const prev = Math.max(state.currentStep - 1, 1);
      return {
        ...state,
        currentStep: prev,
        steps: state.steps.map((s) => ({
          ...s,
          completed: s.step < prev,
          active: s.step === prev,
        })),
      };
    }

    case "UPDATE_DATA":
      return {
        ...state,
        reservationData: {
          ...state.reservationData,
          ...action.payload,
          customerInfo: {
            ...state.reservationData.customerInfo,
            ...(action.payload.customerInfo ?? {}),
          },
        },
      };

    case "RESET":
      return {
        currentStep: 1,
        reservationData: initialReservationData,
        steps: initialSteps,
        isLoading: false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reservationReducer, {
    currentStep: 1,
    reservationData: initialReservationData,
    steps: initialSteps,
    isLoading: false,
  });

  const nextStep = () => dispatch({ type: "NEXT_STEP" });
  const prevStep = () => dispatch({ type: "PREV_STEP" });

  const updateReservationData = (data: Partial<ReservationData>) =>
    dispatch({ type: "UPDATE_DATA", payload: data });

  const resetReservation = () => dispatch({ type: "RESET" });

  /** ✅ Crear reserva EN EL PASO FINAL */
  const submitReservation = async (): Promise<ReservationResponse | null> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const d = state.reservationData;

      if (!d.date || !d.time) {
        console.error("❌ Falta fecha u hora");
        return null;
      }

      const payload: ReservationRequest = {
        customerName: d.customerInfo.fullName.trim(),
        phone: d.customerInfo.phone.trim(),
        email: d.customerInfo.email.trim(),

        date: d.date.toISOString().split("T")[0],
        time: d.time,

        peopleCount: d.peopleCount,
        tableNumber: d.tableNumber ?? undefined,

        note: d.customerInfo.note || undefined,
      };

      const res = await createReservation(payload);
      return res;
    } catch (err) {
      console.error("❌ Error en submitReservation:", err);
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: ReservationContextType = {
    currentStep: state.currentStep,
    reservationData: state.reservationData,
    steps: state.steps,
    nextStep,
    prevStep,
    updateReservationData,
    submitReservation,
    resetReservation,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}
