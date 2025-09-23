import { useContext } from "react";
import { ToastContext, type ToastCtx } from "./toast-context";

export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider/>");
  return ctx;
}

export default useToast;
