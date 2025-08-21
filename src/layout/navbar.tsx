import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

type Item = { label: string; hash: string };
const items: Item[] = [
  { label: "Inicio",     hash: "#top" },
  { label: "Menú",       hash: "#menu" },
  { label: "Reservar",   hash: "#reservar" },
  { label: "Mudecoop",   hash: "#mudecoop" },
  { label: "Turismo",    hash: "#turismo" },
];

export default function Navbar() {
  const location = useLocation();

  useEffect(() => {
    const handler = () => {};
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const linkBase =
    "rounded-xl px-3 py-1.5 text-sm font-semibold text-black " +
    "transition-colors duration-200 ease-out " +
    "hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 " +
    "md:px-4 md:py-2 md:text-base";

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
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div
          className="
            flex flex-wrap items-center justify-center gap-2
            /* overflow-x-auto whitespace-nowrap no-scrollbar */
            md:flex-nowrap md:gap-6
          "
          aria-label="Navegación principal"
          role="navigation"
        >
          {items.map(renderLink)}
        </div>
      </div>
      <div className="h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
    </nav>
  );
}