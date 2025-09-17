"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  UsersRound,
  Images,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

type RoleName = "ADMIN" | "EDITOR";

type SidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleCollapse?: () => void;
};

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  roles?: RoleName[];
  end?: boolean;
};

const SIDEBAR_W_EXPANDED = 260;
const SIDEBAR_W_COLLAPSED = 76;
const LS_COLLAPSE = "adminSidebarCollapsed";

// 🎨 Paleta institucional adaptada
const BRAND_700 = "#0B6A41";
const BRAND_600 = "#0D784A";
const BRAND_50 = "#E6F4EE";
const INK_500 = "#475569";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const NAV: NavItem[] = [
  { to: "/admin", label: "Resumen", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "EDITOR"], end: true },
  { to: "/admin/menu", label: "Menú", icon: <UtensilsCrossed size={20} />, roles: ["ADMIN"] },
  { to: "/admin/reservas", label: "Reservas", icon: <CalendarDays size={20} />, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/biografia", label: "Biografía", icon: <UsersRound size={20} />, roles: ["ADMIN"] },
  { to: "/admin/galeria", label: "Galería", icon: <Images size={20} />, roles: ["ADMIN", "EDITOR"] },
  { to: "/admin/contacto", label: "Contacto", icon: <MessageSquareText size={20} />, roles: ["ADMIN"] },
];

export default function Sidebar(props: SidebarProps) {
  const { mobileOpen: mobileOpenProp, setMobileOpen: setMobileOpenProp, collapsed: collapsedProp, setCollapsed: setCollapsedProp, onToggleCollapse } = props;

  const { user } = useAuth();
  const userRole = (user?.role?.name ?? "EDITOR") as RoleName;

  const isCollapsedControlled = typeof collapsedProp === "boolean" && !!setCollapsedProp;
  const [collapsedLocal, setCollapsedLocal] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_COLLAPSE) === "1"; } catch { return false; }
  });
  const collapsed = isCollapsedControlled ? (collapsedProp as boolean) : collapsedLocal;
  const setCollapsed = isCollapsedControlled ? (setCollapsedProp as typeof setCollapsedLocal) : setCollapsedLocal;

  useEffect(() => {
    try { localStorage.setItem(LS_COLLAPSE, collapsed ? "1" : "0"); } catch {
      // no hacer nada
    }
  }, [collapsed]);

  const isControlled = typeof mobileOpenProp === "boolean" && !!setMobileOpenProp;
  const [mobileOpenInternal, setMobileOpenInternal] = useState(false);
  const mobileOpen = isControlled ? (mobileOpenProp as boolean) : mobileOpenInternal;
  const setMobileOpen = isControlled ? (setMobileOpenProp as typeof setMobileOpenInternal) : setMobileOpenInternal;

  const location = useLocation();
  useEffect(() => { setMobileOpen(false); }, [location.pathname, setMobileOpen]);

  const navItems = useMemo(() => NAV.filter((it) => !it.roles || it.roles.includes(userRole)), [userRole]);

  const brandVars: CSSVars = { "--brand-50": BRAND_50, "--brand-600": BRAND_600, "--brand-700": BRAND_700 };
  const inkVars: CSSVars = { "--ink-500": INK_500 };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white/95 backdrop-blur border-r border-neutral-200 transition-[width,transform]
                    md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED }}
      >
        <div className="h-16 flex items-center gap-3 px-3">
          {!collapsed && (
            <>
              <div
                className="relative w-10 h-10 rounded-xl overflow-hidden grid place-items-center"
                style={{ background: BRAND_50 }}
              >
                <img
                  src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
                  alt="MUDECOOP"
                  className="w-8 h-8 object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <Menu className="absolute text-[color:var(--brand-600)]" size={18} style={brandVars} />
              </div>

              <div className="min-w-0">
                <div className="font-semibold leading-tight text-neutral-900">Restaurante Flotante</div>
                <div className="text-xs text-neutral-500">Panel Administrativo</div>
              </div>
            </>
          )}

          <button
            className="ml-auto rounded-lg p-2 hover:bg-neutral-100"
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse();
              else setCollapsed((c) => !c);
            }}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="px-2 py-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={!!it.end}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                  isActive
                    ? "bg-[color:var(--brand-600)] text-white shadow-sm"
                    : "text-neutral-800 hover:bg-[color:var(--brand-50)] hover:text-[color:var(--brand-600)]",
                ].join(" ")
              }
              style={brandVars}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full"
                      style={{ background: BRAND_700 }}
                    />
                  )}
                  <span
                    className={[
                      "grid place-items-center rounded-lg p-1.5 transition-colors",
                      isActive ? "text-white" : "text-[color:var(--ink-500)] group-hover:text-[color:var(--brand-600)]",
                    ].join(" ")}
                    style={{ ...brandVars, ...inkVars }}
                  >
                    {it.icon}
                  </span>
                  {!collapsed && (
                    <span className={isActive ? "font-medium text-white" : "group-hover:text-[color:var(--brand-600)]"}>
                      {it.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
            <div className="text-xs text-neutral-500">© {new Date().getFullYear()} Restaurante Flotante</div>
          </div>
        )}
      </aside>
    </>
  );
}
