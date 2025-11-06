// src/modules/users/components/ChangePasswordModal.tsx
import { useState } from 'react';
import ModalBase from '../../ui/ModalBase';
import FormField, { inputClass } from '../../ui/FormField';
import Button from '../../ui/Button';
import type { User } from '../../../types/users/user';

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (id: number, password: string) => Promise<void>;
  submitting: boolean;
}

export default function ChangePasswordModal({ open, user, onClose, onSubmit, submitting }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validate = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Debe contener mayúscula y número';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme la contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    await onSubmit(user.id, password);
    handleClose();
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  if (!user) return null;

  return (
    <ModalBase open={open} title="Cambiar contraseña" onClose={handleClose} width="450px">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            Usuario: <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
        </div>

        <FormField label="Nueva contraseña *">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Debe tener mayúscula y número</p>
        </FormField>

        <FormField label="Confirmar contraseña *">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="Repita la contraseña"
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={submitting}>
            Cambiar contraseña
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}