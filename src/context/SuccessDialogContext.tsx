// src/context/SuccessDialogContext.tsx
import { createContext } from "react";

export interface SuccessDialogContextValue {
  open: boolean;
  message: string | null;

  show: (msg: string) => void;
  close: () => void;
}

export const SuccessDialogContext = createContext<SuccessDialogContextValue>({
  open: false,
  message: null,

  show: () => {},
  close: () => {},
});
