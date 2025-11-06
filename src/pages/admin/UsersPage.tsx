import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import UsersTable from '../../components/admin/users/UsersTable';
import CreateUserModal from '../../components/admin/users/CreateUserModal';
import EditUserModal from '../../components/admin/users/EditUserModal';
import ChangeRoleModal from '../../components/admin/users/ChangeRoleModal';
import ChangePasswordModal from '../../components/admin/users/ChangePasswordModal';
import { useUsers } from '../../hooks/users/useUsers';
import { useUserForm } from '../../hooks/users/useUserForm';
import type { User } from '../../types/users/user';

export default function UsersPage() {
  const { users, roles, loading, reload } = useUsers();
  const { submitting, create, update, updateRole, updateStatus, updatePassword } =
    useUserForm(reload);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setRoleOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setPasswordOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setStatusDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
    await updateStatus(selectedUser.id, newStatus);
    setStatusDialog(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D784A] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0D784A]">Gestión de usuarios</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus size={18} className="mr-2" />
          Crear usuario
        </Button>
      </div>

      <UsersTable
        users={users}
        roles={roles}
        onEdit={handleEdit}
        onChangeRole={handleChangeRole}
        onChangePassword={handleChangePassword}
        onToggleStatus={handleToggleStatus}
      />

      <CreateUserModal
        open={createOpen}
        roles={roles}
        onClose={() => setCreateOpen(false)}
        onSubmit={create}
        submitting={submitting}
      />

      <EditUserModal
        open={editOpen}
        user={selectedUser}
        onClose={() => {
          setEditOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={update}
        submitting={submitting}
      />

      <ChangeRoleModal
        open={roleOpen}
        user={selectedUser}
        roles={roles}
        onClose={() => {
          setRoleOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={updateRole}
        submitting={submitting}
      />

      <ChangePasswordModal
        open={passwordOpen}
        user={selectedUser}
        onClose={() => {
          setPasswordOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={updatePassword}
        submitting={submitting}
      />

      <ConfirmDialog
        open={statusDialog}
        title={selectedUser?.status === 'active' ? 'Inactivar usuario' : 'Activar usuario'}
        message={
          selectedUser?.status === 'active'
            ? `¿Está seguro de inactivar a ${selectedUser.firstName} ${selectedUser.lastName}?`
            : `¿Está seguro de activar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`
        }
        confirmText={selectedUser?.status === 'active' ? 'Inactivar' : 'Activar'}
        onConfirm={confirmToggleStatus}
        onCancel={() => {
          setStatusDialog(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
