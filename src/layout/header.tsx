import { Link } from "react-router-dom";
import { User, Sun, Moon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";

type Lang = "es" | "en";

function FlagCR(props: { className?: string }) {
  return (
    <svg viewBox="0 0 9 6" className={props.className}>
      <rect width="9" height="6" fill="#002B7F" />
      <rect y="1" width="9" height="4" fill="#FFFFFF" />
      <rect y="2" width="9" height="2" fill="#CE1126" />
    </svg>
  );
}

function FlagUS(props: { className?: string }) {
  return (
    <svg viewBox="0 0 7410 3900" className={props.className}>
      <rect width="7410" height="3900" fill="#b22234" />
      <path
        fill="#fff"
        d="M0,450 h7410 v300 H0 z M0,1050 h7410 v300 H0 z M0,1650 h7410 v300 H0 z M0,2250 h7410 v300 H0 z M0,2850 h7410 v300 H0 z M0,3450 h7410 v300 H0 z"
      />
      <rect width="2964" height="2100" fill="#3c3b6e" />
    </svg>
  );
}

export default function Header() {
  const { t } = useTranslation("header");

  // === Theme ===
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // === Language ===
  const [lang, setLang] = useState<Lang>("es");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const stored = (localStorage.getItem("lang") as Lang) || "es";
    setLang(stored);
    i18n.changeLanguage(stored);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const applyLanguage = (next: Lang) => {
    if (next === lang) return;
    setLang(next);
    localStorage.setItem("lang", next);
    i18n.changeLanguage(next);
    setOpen(false);
  };

  const CurrentFlag =
    lang === "es"
      ? () => <FlagCR className="h-5 w-5 sm:h-6 sm:w-6 rounded-[2px]" />
      : () => <FlagUS className="h-5 w-5 sm:h-6 sm:w-6 rounded-[2px]" />;

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
            {t("app_name")}
          </span>
        </Link>

        {/* Acciones: idioma, tema, usuario */}
        <div className="flex items-center gap-1.5 sm:gap-2 basis-full sm:basis-auto justify-end order-2 sm:order-none">
          {/* Idioma */}
          <div className="relative" ref={menuRef}>
            <button
              ref={btnRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              title={lang === "es" ? t("change_to_en") : t("change_to_es")}
              aria-label={t("language")}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <CurrentFlag />
              <ChevronDown className="h-4 w-4 opacity-80" />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 rounded-lg border border-white/20 bg-brand text-white shadow-lg"
              >
                <button
                  role="menuitem"
                  onClick={() => applyLanguage("es")}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-t-lg hover:bg-white/10 ${
                    lang === "es" ? "font-semibold" : ""
                  }`}
                >
                  <FlagCR className="h-4 w-4 rounded-[2px]" />
                  <span>Español (CR)</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => applyLanguage("en")}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-b-lg hover:bg-white/10 ${
                    lang === "en" ? "font-semibold" : ""
                  }`}
                >
                  <FlagUS className="h-4 w-4 rounded-[2px]" />
                  <span>English (US)</span>
                </button>
              </div>
            )}
          </div>

          {/* Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? t("theme_light") : t("theme_dark")}
            aria-label={theme === "dark" ? t("theme_light") : t("theme_dark")}
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
            title={t("login")}
            aria-label={t("login")}
          >
            <User className="h-5 w-5 sm:h-7 sm:w-7" />
          </Link>
        </div>
      </div>
    </header>
  );
}
