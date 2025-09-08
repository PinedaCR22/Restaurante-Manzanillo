// src/layouts/admin/AdminLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b p-4 flex items-center justify-between">
        <Link to="/admin" className="font-semibold">MUDECOOP • Panel</Link>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-70">{user?.email} • {user?.role?.name}</span>
          <button onClick={() => logout()} className="px-3 py-1 border rounded">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
