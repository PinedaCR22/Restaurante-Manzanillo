// src/modules/users/components/EditUserModal.tsx
import { useState, useEffect } from 'react';
import ModalBase from '../../ui/ModalBase';
import FormField, { inputClass } from '../../ui/FormField';
import Button from '../../ui/Button';
import type { User, UpdateUserDto } from '../../../types/users/user';

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (id: number, dto: UpdateUserDto) => Promise<void>;
  submitting: boolean;
}

export default function EditUserModal({ open, user, onClose, onSubmit, submitting }: Props) {
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserDto, string>>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        secondLastName: user.secondLastName || '',
        email: user.email,
      });
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserDto, string>> = {};

    if (!formData.firstName?.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName?.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email?.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    await onSubmit(user.id, formData);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!user) return null;

  return (
    <ModalBase open={open} title="Editar usuario" onClose={handleClose} width="550px">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Nombre *">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={inputClass}
            />
            {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
          </FormField>

          <FormField label="Primer apellido *">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={inputClass}
            />
            {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
          </FormField>
        </div>

        <FormField label="Segundo apellido">
          <input
            type="text"
            value={formData.secondLastName}
            onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
            className={inputClass}
          />
        </FormField>

        <FormField label="Correo electrónico *">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={submitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}