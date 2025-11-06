import { useContext } from "react";
import { SuccessDialogContext } from "../context/SuccessDialogContext";
import type { SuccessDialogContextValue } from "../context/SuccessDialogContext";

export function useSuccessDialogContext(): SuccessDialogContextValue {
  const context = useContext(SuccessDialogContext);
  if (!context) {
    throw new Error("useSuccessDialogContext must be used within a SuccessDialogProvider");
  }
  return context;
}