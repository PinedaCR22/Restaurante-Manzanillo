import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import HeaderAdmin from "./HeaderAdmin";

const HEADER_H = 64;
const LS_COLLAPSE = "adminSidebarCollapsed";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_COLLAPSE) === "1";
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  function onToggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(LS_COLLAPSE, next ? "1" : "0");
      } catch {
        // do nothing
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
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 relative">

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

      <HeaderAdmin
        onLogout={handleLogout}
        onToggleSidebar={() => setMobileOpen((v) => !v)}
        userName={user?.firstName ?? "Administrador"}
      />

      <main
        className={[
          "pt-20 md:pt-24 px-4 md:px-8 transition-all duration-300",
          collapsed ? "md:pl-[76px]" : "md:pl-[260px]",
        ].join(" ")}
        style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}
      >
        <div className="max-w-7xl mx-auto pt-4">
          <Outlet />
        </div>
      </main>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
