import { useCallback, useState } from "react";
import SuccessDialog from "./SuccessDialog";
import { SuccessDialogContext } from "../../context/SuccessDialogContext";

export function SuccessDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("Operación exitosa");
  const [message, setMessage] = useState<string>("Operación realizada correctamente.");

  const show = useCallback((t?: string, m?: string) => {
    if (t) setTitle(t);
    if (m) setMessage(m);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <SuccessDialogContext.Provider value={{ open, show, close }}>
      {children}
      <SuccessDialog open={open} onClose={close} title={title} message={message} />
    </SuccessDialogContext.Provider>
  );
}

