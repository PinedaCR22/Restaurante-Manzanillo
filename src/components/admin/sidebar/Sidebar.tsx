"use client";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Building2,
  LifeBuoy,
  HelpCircle,
  Bot,
  CalendarDays,
  Images,
  UsersRound,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
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
  to?: string;
  label: string;
  icon?: ReactNode;
  roles?: RoleName[];
  end?: boolean;
  children?: NavItem[];
};

// ===================== CONFIGURACIÓN =====================
const SIDEBAR_W_EXPANDED = 260;
const SIDEBAR_W_COLLAPSED = 76;
const LS_COLLAPSE = "adminSidebarCollapsed";
const LS_GROUPS = "adminSidebarGroups";

const COLORS = {
  brand50: "#E6F4EE",
  brand600: "#0D784A",
  brand700: "#0B6A41",
  ink500: "#475569",
};

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

// ===================== NAVEGACIÓN =====================
const NAV: NavItem[] = [
  {
    to: "/admin",
    label: "Inicio",
    icon: <LayoutDashboard size={20} />,
    roles: ["ADMIN", "EDITOR"],
    end: true,
  },
  {
    label: "Restaurante",
    icon: <UtensilsCrossed size={20} />,
    children: [
      { to: "/admin/menu", label: "Menú", icon: <UtensilsCrossed size={18} /> },
      { to: "/admin/reservas", label: "Reservas", icon: <CalendarDays size={18} /> },
      { to: "/admin/contacto", label: "Contacto", icon: <MessageSquareText size={18} /> },
    ],
  },
  {
    label: "Información del Sitio",
    icon: <Building2 size={20} />,
    children: [
      { to: "/admin/galeria", label: "Galería", icon: <Images size={18} /> },
      { to: "/admin/biografia", label: "Biografía", icon: <UsersRound size={18} /> },
      { to: "/admin/actividades", label: "Actividades", icon: <CalendarDays size={18} /> },
    ],
  },
  {
    label: "Centro de Ayuda",
    icon: <LifeBuoy size={20} />,
    children: [
      { to: "/admin/faqs", label: "Preguntas Frecuentes", icon: <HelpCircle size={18} /> },
      { to: "/admin/chatbot", label: "Chatbot", icon: <Bot size={18} /> },
    ],
  },
];

// ===================== COMPONENTE PRINCIPAL =====================
export default function Sidebar(props: SidebarProps) {
  const {
    mobileOpen: mobileOpenProp,
    setMobileOpen: setMobileOpenProp,
    collapsed: collapsedProp,
    setCollapsed: setCollapsedProp,
    onToggleCollapse,
  } = props;

  const { user } = useAuth();
  const userRole = (user?.role?.name ?? "EDITOR") as RoleName;

  const [collapsedLocal, setCollapsedLocal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_COLLAPSE) === "1";
    } catch {
      return false;
    }
  });
  const collapsed = collapsedProp ?? collapsedLocal;
  const setCollapsed = setCollapsedProp ?? setCollapsedLocal;

  const [mobileOpenInternal, setMobileOpenInternal] = useState(false);
  const mobileOpen = mobileOpenProp ?? mobileOpenInternal;
  const setMobileOpen = setMobileOpenProp ?? setMobileOpenInternal;

  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname, setMobileOpen]);

  const navItems = useMemo(
    () =>
      NAV.filter((it) => !it.roles || it.roles.includes(userRole)).map((group) => ({
        ...group,
        children: group.children?.filter((c) => !c.roles || c.roles.includes(userRole)),
      })),
    [userRole]
  );

  const brandVars: CSSVars = {
    "--brand-50": COLORS.brand50,
    "--brand-600": COLORS.brand600,
    "--brand-700": COLORS.brand700,
  };
  const inkVars: CSSVars = { "--ink-500": COLORS.ink500 };

  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white/95 backdrop-blur border-r border-neutral-200 transition-[width,transform]
                    md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED }}
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-3">
          {!collapsed && (
            <>
              <div
                className="relative w-10 h-10 rounded-xl overflow-hidden grid place-items-center bg-[color:var(--brand-50)]"
                style={brandVars}
              >
                <img
                  src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
                  alt="MUDECOOP"
                  className="w-8 h-8 object-contain"
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
            onClick={() => (onToggleCollapse ? onToggleCollapse() : setCollapsed((c) => !c))}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navegación */}
        <nav className="px-2 py-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item, i) =>
            item.children ? (
              <SidebarGroup key={i} item={item} collapsed={collapsed} brandVars={brandVars} inkVars={inkVars} />
            ) : (
              <SidebarLink key={i} item={item} collapsed={collapsed} brandVars={brandVars} inkVars={inkVars} />
            )
          )}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
            <div className="text-xs text-neutral-500">© {new Date().getFullYear()} Restaurante Flotante</div>
          </div>
        )}
      </aside>
    </>
  );
}

// ===================== ENLACES Y SUBMENÚS =====================
function SidebarLink({ item, collapsed, brandVars, inkVars }: { item: NavItem; collapsed: boolean; brandVars: CSSVars; inkVars: CSSVars }) {
  return (
    <NavLink
      to={item.to ?? "#"}
      end={!!item.end}
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
          {item.icon && (
            <span
              className={[
                "grid place-items-center rounded-lg p-1.5 transition-colors",
                isActive ? "text-white" : "text-[color:var(--ink-500)] group-hover:text-[color:var(--brand-600)]",
              ].join(" ")}
              style={{ ...brandVars, ...inkVars }}
            >
              {item.icon}
            </span>
          )}
          {!collapsed && <span className={isActive ? "font-medium text-white" : "group-hover:text-[color:var(--brand-600)]"}>{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

function SidebarGroup({
  item,
  collapsed,
  brandVars,
  inkVars,
}: {
  item: NavItem;
  collapsed: boolean;
  brandVars: CSSVars;
  inkVars: CSSVars;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_GROUPS) ?? "{}");
    } catch {
      return {};
    }
  });

  const [hover, setHover] = useState(false);
  const open = openGroups[item.label] ?? false;

  const toggle = () => {
    const updated = { ...openGroups, [item.label]: !open };
    setOpenGroups(updated);
    localStorage.setItem(LS_GROUPS, JSON.stringify(updated));
  };

  return (
    <div className="relative group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        onClick={!collapsed ? toggle : undefined}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] text-neutral-800 hover:bg-[color:var(--brand-50)] hover:text-[color:var(--brand-600)] transition-colors"
        style={brandVars}
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <span
              className="grid place-items-center rounded-lg p-1.5 text-[color:var(--ink-500)] group-hover:text-[color:var(--brand-600)]"
              style={{ ...brandVars, ...inkVars }}
            >
              {item.icon}
            </span>
          )}
          {!collapsed && <span className="font-medium">{item.label}</span>}
        </div>
        {!collapsed && <span className="text-neutral-500">{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
      </button>

      {!collapsed && open && item.children && (
        <div className="ml-6 mt-1 space-y-0.5">
          {item.children.map((child, idx) => (
            <SidebarLink key={idx} item={child} collapsed={collapsed} brandVars={brandVars} inkVars={inkVars} />
          ))}
        </div>
      )}

      {collapsed && hover && (
        <div className="absolute left-full top-0 ml-2 bg-white border border-neutral-200 rounded-lg shadow-md p-2 w-52 z-50 animate-fadeIn">
          {item.children?.map((child, idx) => (
            <NavLink
              key={idx}
              to={child.to ?? "#"}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-[color:var(--brand-50)] hover:text-[color:var(--brand-600)] transition-colors"
            >
              {child.icon && <span className="text-[color:var(--brand-600)]">{child.icon}</span>}
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
