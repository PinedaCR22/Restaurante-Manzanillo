import { useCallback, useState } from "react";
import SuccessDialog from "../components/ui/SuccessDialog";

export function useSuccessDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("Operación exitosa");
  const [message, setMessage] = useState<string>("Operación realizada correctamente.");

  const show = useCallback((t?: string, m?: string) => {
    if (t) setTitle(t);
    if (m) setMessage(m);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const Dialog = useCallback(() => {
    return <SuccessDialog open={open} onClose={close} title={title} message={message} />;
  }, [open, title, message, close]);

  return { open, show, close, Dialog } as const;
}

export default useSuccessDialog;
