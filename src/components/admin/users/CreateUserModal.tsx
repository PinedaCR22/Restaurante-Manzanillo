// src/modules/users/components/CreateUserModal.tsx
import { useState } from 'react';
import ModalBase from '../../ui/ModalBase';
import FormField, { inputClass, selectClass } from '../../ui/FormField';
import Button from '../../ui/Button';
import type { Role, CreateUserDto } from '../../../types/users/user';

interface Props {
  open: boolean;
  roles: Role[];
  onClose: () => void;
  onSubmit: (dto: CreateUserDto) => Promise<void>;
  submitting: boolean;
}

export default function CreateUserModal({ open, roles, onClose, onSubmit, submitting }: Props) {
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    password: '',
    roleId: roles[0]?.id || 0,
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserDto, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserDto, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúscula y número';
    }
    if (!formData.roleId) newErrors.roleId = 'Seleccione un rol';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      secondLastName: '',
      email: '',
      password: '',
      roleId: roles[0]?.id || 0,
      status: 'active',
    });
    setErrors({});
    onClose();
  };

  return (
    <ModalBase open={open} title="Crear usuario" onClose={handleClose} width="550px">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Nombre *">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={inputClass}
              placeholder="Juan"
            />
            {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
          </FormField>

          <FormField label="Primer apellido *">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={inputClass}
              placeholder="Pérez"
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
            placeholder="González"
          />
        </FormField>

        <FormField label="Correo electrónico *">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder="usuario@mudecoop.cr"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </FormField>

        <FormField label="Contraseña *">
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Debe tener mayúscula y número</p>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Rol *">
            <select
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
              className={selectClass}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.roleId && <p className="text-xs text-red-600 mt-1">{errors.roleId}</p>}
          </FormField>

          <FormField label="Estado *">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className={selectClass}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={submitting}>
            Crear usuario
          </Button>
        </div>
      </form>
    </ModalBase>
  );
}