import { createContext } from "react";

export interface SuccessDialogContextValue {
  open: boolean;
  show: (title?: string, message?: string) => void;
  close: () => void;
}

export const SuccessDialogContext = createContext<SuccessDialogContextValue | null>(null);