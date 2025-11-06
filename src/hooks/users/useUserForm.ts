import { useState } from 'react';
import { usersService } from '../../services/users/users.service';
import { useToast } from '../useToast';
import { useSuccessDialog } from '../useSuccessDialog';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserStatus,
} from '../../types/users/user';
import type { ApiError } from '../../lib/http';

export function useUserForm(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();
  const { show } = useSuccessDialog();

  const create = async (dto: CreateUserDto) => {
    try {
      setSubmitting(true);
      await usersService.createUser(dto);
      show('Usuario creado', 'El usuario se ha creado exitosamente.');
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      push({
        type: 'error',
        title: 'Error al crear usuario',
        message: error.message || 'No se pudo crear el usuario',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id: number, dto: UpdateUserDto) => {
    try {
      setSubmitting(true);
      await usersService.updateUser(id, dto);
      show('Usuario actualizado', 'Los datos se han actualizado correctamente.');
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      push({
        type: 'error',
        title: 'Error al actualizar',
        message: error.message || 'No se pudo actualizar el usuario',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateRole = async (id: number, roleId: number) => {
    try {
      setSubmitting(true);
      await usersService.updateRole(id, { roleId });
      show('Rol actualizado', 'El rol del usuario se ha cambiado correctamente.');
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      push({
        type: 'error',
        title: 'Error al cambiar rol',
        message: error.message || 'No se pudo cambiar el rol',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: number, status: UserStatus) => {
    try {
      setSubmitting(true);
      await usersService.updateStatus(id, { status });
      show(
        'Estado actualizado',
        `El usuario ha sido ${status === 'active' ? 'activado' : 'inactivado'}.`
      );
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      push({
        type: 'error',
        title: 'Error al cambiar estado',
        message: error.message || 'No se pudo cambiar el estado',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updatePassword = async (id: number, password: string) => {
    try {
      setSubmitting(true);
      await usersService.updatePassword(id, { password });
      show('Contraseña actualizada', 'La contraseña se ha cambiado correctamente.');
      onSuccess();
    } catch (err) {
      const error = err as ApiError;
      push({
        type: 'error',
        title: 'Error al cambiar contraseña',
        message: error.message || 'No se pudo cambiar la contraseña',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, create, update, updateRole, updateStatus, updatePassword };
}
