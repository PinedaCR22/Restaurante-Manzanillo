import { useEffect, useState } from "react";
import { Mail, UserCircle2, Lock, UserPlus } from "lucide-react";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import UsersTable from "../../components/admin/users/UsersTable";
import CreateUserModal from "../../components/admin/users/CreateUserModal";
import EditUserModal from "../../components/admin/users/EditUserModal";
import ChangeRoleModal from "../../components/admin/users/ChangeRoleModal";
import ChangePasswordModal from "../../components/admin/users/ChangePasswordModal";
import ChangePasswordDialog from "../../components/admin/users/ChangePasswordDialog"; // ✅ nuevo modal
import { useUsers } from "../../hooks/users/useUsers";
import { useUserForm } from "../../hooks/users/useUserForm";
import { usersService } from "../../services/users/users.service";
import type { User } from "../../types/users/user";
import useAuth from "../../hooks/useAuth";

export default function ConfigPage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passDialog, setPassDialog] = useState(false); // ✅ estado para modal
  const { submitting, update, updatePassword } = useUserForm(() => loadProfile());

  // Hook de usuarios (internamente ya evita 403)
  const { users, roles, loading: usersLoading, reload } = useUsers();

  const {
    submitting: submittingAdmin,
    create,
    update: updateUser,
    updateRole,
    updateStatus,
    updatePassword: adminUpdatePassword,
  } = useUserForm(reload);

  // Modales de admin
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);
      const me = await usersService.getMe();
      setProfile(me);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando configuración...
      </div>
    );

  if (!profile)
    return (
      <p className="text-center text-gray-600">
        No se pudo cargar la información del usuario.
      </p>
    );

  // === ADMIN ===
  const isAdmin = authUser?.role?.name === "ADMIN";

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
    const newStatus = selectedUser.status === "active" ? "inactive" : "active";
    await updateStatus(selectedUser.id, newStatus);
    setStatusDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ================== PERFIL ================== */}
      <div>
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-24 h-24 rounded-full bg-[#E6F4EE] flex items-center justify-center mb-3 shadow-sm">
            <UserCircle2 size={64} color="#0D784A" />
          </div>
          <h1 className="text-3xl font-bold text-[#0D784A]">
            Configuración del Usuario
          </h1>
          <p className="text-gray-600 mt-1">
            Actualiza tu información personal y credenciales.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 space-y-10">
          {/* Sección 1: Información Personal */}
          <section>
            <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
              Información Personal
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await update(profile.id, {
                  firstName: profile.firstName ?? "",
                  lastName: profile.lastName ?? "",
                  secondLastName: profile.secondLastName ?? "",
                  email: profile.email,
                });
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profile.firstName ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primer Apellido
                </label>
                <input
                  type="text"
                  value={profile.lastName ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  value={profile.secondLastName ?? ""}
                  onChange={(e) =>
                    setProfile({ ...profile, secondLastName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </section>

          {/* Sección 2: Seguridad */}
          <section>
            <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
              Seguridad
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Lock className="text-[#0D784A]" />
                <span>Cambiar contraseña de acceso</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => setPassDialog(true)}
              >
                Cambiar Contraseña
              </Button>

              {/* ✅ Nuevo modal elegante */}
              <ChangePasswordDialog
                open={passDialog}
                onClose={() => setPassDialog(false)}
                onConfirm={async (password) => {
                  await updatePassword(profile.id, password);
                  setPassDialog(false);
                }}
                submitting={submitting}
              />
            </div>
          </section>
        </div>
      </div>

      {/* ================== GESTIÓN DE USUARIOS (ADMIN) ================== */}
      {isAdmin && (
        <div>
          <div className="flex items-center justify-between mb-6 mt-12">
            <div>
              <h2 className="text-2xl font-bold text-[#0D784A]">
                Gestión de Usuarios
              </h2>
              <p className="text-gray-600 mt-1">
                Crea, edita y administra los usuarios del sistema.
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <UserPlus size={18} className="mr-2" />
              Crear Usuario
            </Button>
          </div>

          {usersLoading ? (
            <div className="text-center text-gray-500">Cargando usuarios...</div>
          ) : (
            <UsersTable
              users={users}
              roles={roles}
              onEdit={handleEdit}
              onChangeRole={handleChangeRole}
              onChangePassword={handleChangePassword}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* Modales de administración */}
          <CreateUserModal
            open={createOpen}
            roles={roles}
            onClose={() => setCreateOpen(false)}
            onSubmit={create}
            submitting={submittingAdmin}
          />

          <EditUserModal
            open={editOpen}
            user={selectedUser}
            onClose={() => {
              setEditOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={updateUser}
            submitting={submittingAdmin}
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
            submitting={submittingAdmin}
          />

          <ChangePasswordModal
            open={passwordOpen}
            user={selectedUser}
            onClose={() => {
              setPasswordOpen(false);
              setSelectedUser(null);
            }}
            onSubmit={adminUpdatePassword}
            submitting={submittingAdmin}
          />

          <ConfirmDialog
            open={statusDialog}
            title={
              selectedUser?.status === "active"
                ? "Inactivar usuario"
                : "Activar usuario"
            }
            message={
              selectedUser?.status === "active"
                ? `¿Está seguro de inactivar a ${selectedUser.firstName} ${selectedUser.lastName}?`
                : `¿Está seguro de activar a ${selectedUser?.firstName} ${selectedUser?.lastName}?`
            }
            confirmText={
              selectedUser?.status === "active" ? "Inactivar" : "Activar"
            }
            onConfirm={confirmToggleStatus}
            onCancel={() => {
              setStatusDialog(false);
              setSelectedUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
