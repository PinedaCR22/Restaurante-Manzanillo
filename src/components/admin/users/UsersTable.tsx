// src/modules/users/components/UsersTable.tsx
import { useState } from 'react';
import { Edit, Key, UserCog, UserX, UserCheck } from 'lucide-react';
import type { User, Role } from '../../../types/users/user';

interface Props {
  users: User[];
  roles: Role[];
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onChangePassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export default function UsersTable({
  users,
  onEdit,
  onChangeRole,
  onChangePassword,
  onToggleStatus,
}: Props) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName} ${u.secondLastName || ''}`.toLowerCase();
    const email = u.email.toLowerCase();
    const role = u.role.name.toLowerCase();
    const term = search.toLowerCase();
    return fullName.includes(term) || email.includes(term) || role.includes(term);
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header con búsqueda */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none transition"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#E6F4EE] text-[#0D784A]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Rol</th>
              <th className="px-4 py-3 text-center font-semibold">Estado</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    {user.secondLastName && (
                      <div className="text-xs text-gray-500">{user.secondLastName}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6F4EE] text-[#0D784A]">
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                        title="Editar datos"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onChangeRole(user)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                        title="Cambiar rol"
                      >
                        <UserCog size={16} />
                      </button>
                      <button
                        onClick={() => onChangePassword(user)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                        title="Cambiar contraseña"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`p-1.5 rounded-lg transition ${
                          user.status === 'active'
                            ? 'hover:bg-red-50 text-red-600'
                            : 'hover:bg-emerald-50 text-emerald-600'
                        }`}
                        title={user.status === 'active' ? 'Inactivar' : 'Activar'}
                      >
                        {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}