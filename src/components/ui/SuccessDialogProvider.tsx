// src/components/ui/SuccessDialogProvider.tsx
import { useState, useCallback } from "react";
import { SuccessDialogContext } from "../../context/SuccessDialogContext";

export function SuccessDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setMessage(null);
  }, []);

  return (
    <SuccessDialogContext.Provider value={{ open, message, show, close }}>
      {children}
    </SuccessDialogContext.Provider>
  );
}
