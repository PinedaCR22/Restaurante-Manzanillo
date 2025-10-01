import { Link } from "react-router-dom";
import { User, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

type Lang = "es" | "en";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<Lang>("es");

  // === Theme bootstrap ===
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "light" | "dark") || null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // === Language bootstrap ===
  useEffect(() => {
    const stored = (localStorage.getItem("lang") as Lang) || "es";
    setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));

  return (
    <header className="bg-brand text-white shadow">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-4">
        {/* Logo + nombre */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
            alt="MUDECOOP"
            className="h-10 w-10 sm:h-14 sm:w-14 object-contain rounded-full shrink-0"
          />
          <span className="font-extrabold tracking-wide leading-tight text-[clamp(1rem,5vw,1.75rem)] whitespace-normal break-words">
            REST. MANZANILLO
          </span>
        </Link>

        {/* Acciones: idioma, tema, usuario */}
        <div className="flex items-center gap-1.5 sm:gap-2 basis-full sm:basis-auto justify-end order-2 sm:order-none">
          {/* Idioma CR/US */}
          <button
            type="button"
            onClick={toggleLang}
            title={lang === "es" ? "Cambiar a English" : "Cambiar a Español"}
            aria-label="Cambiar idioma"
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            {lang === "es" ? (
              <svg viewBox="0 0 9 6" className="h-5 w-5 sm:h-6 sm:w-6 rounded-[2px]">
                <rect width="9" height="6" fill="#002B7F" />
                <rect y="1" width="9" height="4" fill="#FFFFFF" />
                <rect y="2" width="9" height="2" fill="#CE1126" />
              </svg>
            ) : (
              <svg viewBox="0 0 7410 3900" className="h-5 w-5 sm:h-6 sm:w-6 rounded-[2px]">
                <rect width="7410" height="3900" fill="#b22234" />
                <path
                  fill="#fff"
                  d="M0,450 h7410 v300 H0 z M0,1050 h7410 v300 H0 z M0,1650 h7410 v300 H0 z M0,2250 h7410 v300 H0 z M0,2850 h7410 v300 H0 z M0,3450 h7410 v300 H0 z"
                />
                <rect width="2964" height="2100" fill="#3c3b6e" />
              </svg>
            )}
          </button>

          {/* Tema sol/luna */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Cambiar tema"
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>

          {/* Usuario */}
          <Link
            to="/login"
            className="p-2 sm:p-3 rounded-full hover:bg-white/10 transition-colors"
            title="Iniciar sesión"
            aria-label="Iniciar sesión"
          >
            <User className="h-5 w-5 sm:h-7 sm:w-7" />
          </Link>
        </div>
      </div>
    </header>
  );
}
