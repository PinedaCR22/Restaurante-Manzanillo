import { LogOut, Menu, UserCircle2 } from "lucide-react";
import { NotificationsBell } from "../../components/notifications/NotificationsBell";

type Props = {
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  userName?: string;
};

export default function HeaderAdmin({
  onLogout,
  onToggleSidebar,
  userName = "Administrador",
}: Props) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      {/* IZQUIERDA: Botón hamburguesa y nombre */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <UserCircle2 size={22} className="text-[#0D784A]" />
          <span className="text-sm sm:text-base truncate max-w-[140px]">
            {userName}
          </span>
        </div>
      </div>

      {/* DERECHA: Notificaciones + Cerrar sesión */}
      <div className="flex items-center gap-3">
        <NotificationsBell /> {/* 🔔 Campanita de notificaciones */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-[#0D784A] hover:bg-[#0B6A41] text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
