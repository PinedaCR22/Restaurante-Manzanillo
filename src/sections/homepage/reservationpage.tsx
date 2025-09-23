// context/ReservationContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { ReservationData, ReservationStep, ReservationContextType, ReservationRequest } from '../../types/reservation';


const initialReservationData: ReservationData = {
  date: null,
  time: '',
  guests: 2,
  tableId: null,
  customerInfo: {
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  }
};

const initialSteps: ReservationStep[] = [
  { step: 1, title: 'Fecha y Hora', completed: false, active: true },
  { step: 2, title: 'Mesa', completed: false, active: false },
  { step: 3, title: 'Datos', completed: false, active: false },
  { step: 4, title: 'Confirmación', completed: false, active: false },
  { step: 5, title: 'Finalizado', completed: false, active: false }
];

interface ReservationState {
  currentStep: number;
  reservationData: ReservationData;
  steps: ReservationStep[];
  isLoading: boolean;
}

type ReservationAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Partial<ReservationData> }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean };

const reservationReducer = (state: ReservationState, action: ReservationAction): ReservationState => {
  switch (action.type) {
    case 'NEXT_STEP':
      if (state.currentStep < 5) {
        const newSteps = state.steps.map(step => ({
          ...step,
          completed: step.step < state.currentStep + 1,
          active: step.step === state.currentStep + 1
        }));
        return {
          ...state,
          currentStep: state.currentStep + 1,
          steps: newSteps
        };
      }
      return state;

    case 'PREV_STEP':
      if (state.currentStep > 1) {
        const newSteps = state.steps.map(step => ({
          ...step,
          completed: step.step < state.currentStep - 1,
          active: step.step === state.currentStep - 1
        }));
        return {
          ...state,
          currentStep: state.currentStep - 1,
          steps: newSteps
        };
      }
      return state;

    case 'UPDATE_DATA':
      return {
        ...state,
        reservationData: {
          ...state.reservationData,
          ...action.payload,
          customerInfo: {
            ...state.reservationData.customerInfo,
            ...(action.payload.customerInfo || {})
          }
        }
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'RESET':
      return {
        currentStep: 1,
        reservationData: initialReservationData,
        steps: initialSteps,
        isLoading: false
      };

    default:
      return state;
  }
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reservationReducer, {
    currentStep: 1,
    reservationData: initialReservationData,
    steps: initialSteps,
    isLoading: false
  });

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const updateReservationData = (data: Partial<ReservationData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const submitReservation = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Preparar datos para enviar al backend
      const reservationRequest: ReservationRequest = {
        date: state.reservationData.date?.toISOString().split('T')[0] || '',
        time: state.reservationData.time,
        guests: state.reservationData.guests,
        tableId: state.reservationData.tableId || 0,
        customerName: state.reservationData.customerInfo.fullName,
        customerEmail: state.reservationData.customerInfo.email,
        customerPhone: state.reservationData.customerInfo.phone,
        specialRequests: state.reservationData.customerInfo.specialRequests
      };

      // Aquí irá la llamada al backend cuando esté listo
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reservationRequest)
      // });
      
      // Por ahora simulamos la respuesta
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Reserva enviada:', reservationRequest);
      nextStep(); // Ir al paso final
    } catch (error) {
      console.error('Error al enviar reserva:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetReservation = () => {
    dispatch({ type: 'RESET' });
  };

  const value: ReservationContextType = {
    currentStep: state.currentStep,
    reservationData: state.reservationData,
    steps: state.steps,
    nextStep,
    prevStep,
    updateReservationData,
    submitReservation,
    resetReservation
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};