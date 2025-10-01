// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import esHeader from "./locales/es/header.json";
import enHeader from "./locales/en/header.json";
import esNavbar from "./locales/es/navbar.json";
import enNavbar from "./locales/en/navbar.json";
import esHero from "./locales/es/hero.json";
import enHero from "./locales/en/hero.json";
import esFooter from "./locales/es/footer.json";
import enFooter from "./locales/en/footer.json";
import esManzanillo from "./locales/es/manzanillo.json";
import enManzanillo from "./locales/en/manzanillo.json";
import esMudecoop from "./locales/es/mudecoop.json";
import enMudecoop from "./locales/en/mudecoop.json";

const resources = {
  es: {
    header: esHeader,
    navbar: esNavbar,
    hero: esHero,
    footer: esFooter,
    manzanillo: esManzanillo,
    mudecoop: esMudecoop
  },
  en: {
    header: enHeader,
    navbar: enNavbar,
    hero: enHero,
    footer: enFooter,
    manzanillo: enManzanillo,
    mudecoop: enMudecoop
  },
};

const stored = (localStorage.getItem("lang") as "es" | "en") || null;
const lng = stored ?? undefined;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["es", "en"],
    fallbackLng: "es",
    lng,
    defaultNS: "header",
    ns: ["header", "navbar", "hero", "footer", "manzanillo", "mudecoop"], 
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang"
    }
  });

export default i18n;
