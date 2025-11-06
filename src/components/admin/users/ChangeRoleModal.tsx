// src/modules/users/components/ChangeRoleModal.tsx
import { useState, useEffect } from 'react';
import ModalBase from '../../ui/ModalBase';
import FormField, { selectClass } from '../../ui/FormField';
import Button from '../../ui/Button';
import type { User, Role } from '../../../types/users/user';

interface Props {
  open: boolean;
  user: User | null;
  roles: Role[];
  onClose: () => void;
  onSubmit: (id: number, roleId: number) => Promise<void>;
  submitting: boolean;
}

export default function ChangeRoleModal({ open, user, roles, onClose, onSubmit, submitting }: Props) {
  const [roleId, setRoleId] = useState(0);

  useEffect(() => {
    if (user) {
      setRoleId(user.role.id);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await onSubmit(user.id, roleId);
    onClose();
  };

  if (!user) return null;

  return (
    <ModalBase open={open} title="Cambiar rol" onClose={onClose} width="450px">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            Usuario: <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Rol actual: <span className="font-medium text-[#0D784A]">{user.role.name}</span>
          </p>
        </div>

        <FormField label="Nuevo rol">
          <select value={roleId} onChange={(e) => setRoleId(Number(e.target.value))} className={selectClass}>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={submitting}>
            Cambiar rol
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}