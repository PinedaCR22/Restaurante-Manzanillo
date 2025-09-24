import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { LogOut, User2 } from "lucide-react";

const HEADER_H = 64; // px
const LS_COLLAPSE = "adminSidebarCollapsed";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_COLLAPSE) === "1"; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  function onToggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(LS_COLLAPSE, next ? "1" : "0"); } catch {
        // no hacer nada
      }
      return next;
    });
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/"); 
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800">
      {/* Sidebar fijo (desktop) / drawer (mobile) */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {/* Header fijo */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-30 h-16 bg-white/95 backdrop-blur",
          "border-b border-neutral-200 flex items-center justify-between",
          "px-4 md:px-6",
          collapsed ? "md:pl-[76px]" : "md:pl-[260px]",
        ].join(" ")}
      >
        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="md:hidden -ml-1 rounded-lg p-2 hover:bg-neutral-100"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        {/* Títulos */}
        <div className="flex-1 ml-2 md:ml-0">
          <div className="text-lg md:text-xl font-semibold tracking-tight text-[#0D784A]">
            Panel Administrativo
          </div>
          <div className="text-xs text-neutral-600 hidden md:block">
            Gestiona tu restaurante flotante desde este panel centralizado
          </div>
        </div>

        {/* Usuario + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E6F4EE] text-[#0D784A]">
              <User2 size={16} />
            </span>
            <span className="text-sm text-neutral-700">{user?.email ?? "Administrador"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D784A] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0B6A41] active:brightness-95"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main
        className={[
          "pt-16 px-4 md:px-6",
          collapsed ? "md:pl-[76px]" : "md:pl-[260px]",
        ].join(" ")}
        style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}
      >
        <div className="pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
