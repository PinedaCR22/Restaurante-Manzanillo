import { useState } from "react";
import Button from "../../ui/Button";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  submitting?: boolean;
}

export default function ChangePasswordDialog({
  open,
  onClose,
  onConfirm,
  submitting,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 border border-neutral-200">
        <h2 className="text-lg font-semibold text-[#0D784A] mb-3">
          Cambiar contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Ingresa la nueva contraseña para tu cuenta.
        </p>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A] mb-6"
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              await onConfirm(password);
              setPassword("");
            }}
            disabled={submitting || !password}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
