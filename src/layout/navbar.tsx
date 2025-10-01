// src/sections/navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

type Item = { label: string; hash: `#${string}` };

const items: Item[] = [
  { label: "Inicio",   hash: "#hero" },
  { label: "Menú",     hash: "#menu" },
  { label: "Reservar", hash: "#reservar" },
  { label: "Mudecoop", hash: "#mudecoop" },
  { label: "Turismo",  hash: "#turismo" },
];

function smoothScrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      requestAnimationFrame(() => smoothScrollTo(location.hash));
    }
  }, [location.pathname, location.hash]);

  // Reemplazamos colores fijos por variables y helpers
  const linkBase =
    "rounded-xl px-3 py-1.5 text-app hover-bg-card focus-ring " +
    "transition-colors duration-200 ease-out " +
    "md:px-4 md:py-2 md:text-base font-semibold";

  return (
    <nav className="bg-app shadow">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div
          className="flex flex-wrap items-center justify-center gap-2 md:flex-nowrap md:gap-6"
          aria-label="Navegación principal"
          role="navigation"
        >
          {items.map((it) => (
            <Link
              key={it.hash}
              to={`/${it.hash}`}               // si NO estamos en "/", react-router navega y el useEffect hace el scroll
              className={linkBase}
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  smoothScrollTo(it.hash);
                }
              }}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
      {/* línea degradada (sin cambios) */}
      <div className="h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
    </nav>
  );
}
