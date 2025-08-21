import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

type Lang = "es" | "en";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<Lang>("es");

  function handleSignOut() {
    navigate("/login", { replace: true });
  }

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
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
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
    <header className="bg-[#443314] text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo + nombre */}
        <Link to="/admin" className="flex items-center gap-3 min-w-0">
          <img
            src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
            alt="MUDECOOP"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full"
          />
          <span className="font-bold text-xl sm:text-2xl tracking-wide truncate">
            Panel administrativo
          </span>
        </Link>

        {/* Acciones: idioma, tema y cerrar sesión */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón Idioma */}
          <button
            type="button"
            onClick={toggleLang}
            title={lang === "es" ? "Cambiar a English" : "Cambiar a Español"}
            aria-label="Cambiar idioma"
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
          >
            {lang === "es" ? (
              // 🇨🇷 Costa Rica
              <svg viewBox="0 0 9 6" className="h-5 w-5 sm:h-6 sm:w-6 rounded-[2px]">
                <rect width="9" height="6" fill="#002B7F" />
                <rect y="1" width="9" height="4" fill="#FFFFFF" />
                <rect y="2" width="9" height="2" fill="#CE1126" />
              </svg>
            ) : (
              // 🇺🇸 Estados Unidos
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

          {/* Botón Tema */}
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

          {/* Botón cerrar sesión */}
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded px-3 sm:px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 transition text-sm sm:text-lg"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
