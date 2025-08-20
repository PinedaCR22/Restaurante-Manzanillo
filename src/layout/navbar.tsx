import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type Item = { label: string; hash: string }; // id de la sección en Home
const items: Item[] = [
  { label: "Inicio",     hash: "#top" },
  { label: "Menú",       hash: "#menu" },
  { label: "Reservar",   hash: "#reservar" },
  { label: "Mudecoop",   hash: "#mudecoop" },
  { label: "Turismo",    hash: "#turismo" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Cierra menú al pasar a desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const linkBase =
    "rounded-xl px-4 py-2 font-semibold transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 text-black hover:bg-[#FBB517]/55";

  // Si ya estás en "/" hace scroll; si no, navega a "/#hash" y el ScrollToHash se encarga.
  const handleClick = (e: React.MouseEvent, hash: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderLink = (it: Item) => (
    <Link
      key={it.hash}
      to={`/${it.hash}`}
      className={linkBase}
      onClick={(e) => handleClick(e, it.hash)}
    >
      {it.label}
    </Link>
  );

  return (
    <nav className="bg-[#50ABD7] shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="md:hidden" />
        <div className="hidden md:flex gap-6 justify-center w-full">
          {items.map(renderLink)}
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-black/80 hover:bg-black/10 transition-colors duration-200"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/10 bg-[#50ABD7]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            {items.map(renderLink)}
          </div>
        </div>
      )}
    </nav>
  );
}
