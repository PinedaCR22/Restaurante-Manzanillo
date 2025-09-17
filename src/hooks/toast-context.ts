import { createContext } from "react";

export type ToastType = "success" | "error" | "info";
export type ToastItem = { id: number; type: ToastType; title: string; message?: string };

export type ToastCtx = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: number) => void;
};

export const ToastContext = createContext<ToastCtx | null>(null);
