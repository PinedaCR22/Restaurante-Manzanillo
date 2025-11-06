import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useContactPublic } from "../hooks/public/useContactPublic";

type QuickLink = { key: string; hash: `#${string}` };

const quickLinks: QuickLink[] = [
  { key: "menu", hash: "#menu" },
  { key: "reservar", hash: "#reservar" },
  { key: "mudecoop", hash: "#mudecoop" },
  { key: "turismo", hash: "#turismo" }
];

function smoothScrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Footer() {
  const location = useLocation();
  const { t } = useTranslation("footer");
  const { t: tNav } = useTranslation("navbar");

  const { contacts, loading } = useContactPublic();

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      requestAnimationFrame(() => smoothScrollTo(location.hash));
    }
  }, [location.pathname, location.hash]);

  const handleClick = (e: React.MouseEvent, hash: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      smoothScrollTo(hash);
    }
  };

  const phones = contacts.filter((c) => c.kind === "phone");
  const emails = contacts.filter((c) => c.kind === "email");
  const addresses = contacts.filter((c) => c.kind === "address");
  const socials = contacts.filter((c) =>
    ["facebook", "instagram", "tiktok"].includes(c.kind)
  );

  return (
    <footer className="bg-brand text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        {!!loading && (
          <p className="text-sm text-white/80">Cargando contactos…</p>
        )}

        {/* Logo */}
        <img
          src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
          alt="MUDECOOP"
          className="h-12 w-12 object-contain rounded-full mx-auto mb-4"
        />

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
          {/* Columna 1 */}
          <div className="max-w-xs">
            <h2 className="font-semibold mb-3">{t("title")}</h2>
            <p className="text-sm leading-relaxed text-white/90">
              {t("description")}
            </p>
          </div>

          {/* Columna 2 */}
          <div className="max-w-xs">
            <h2 className="font-semibold mb-3">{t("quickLinksTitle")}</h2>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.hash}>
                  <Link
                    to={`/${link.hash}`}
                    className="hover:underline"
                    onClick={(e) => handleClick(e, link.hash)}
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Contactos dinámicos */}
          <div className="max-w-xs flex flex-col items-center">
            <h2 className="font-semibold mb-3">{t("contactTitle")}</h2>

            {!loading && contacts.length === 0 && (
              <p className="text-sm text-white/70">
                Sin información disponible.
              </p>
            )}

            {!loading && contacts.length > 0 && (
              <>
                {addresses.map((a) => (
                  <p
                    key={a.id}
                    className="text-sm text-white/90 flex items-center gap-2 mb-1"
                  >
                    <FaMapMarkerAlt /> {a.value}
                  </p>
                ))}

                {phones.map((p) => (
                  <p
                    key={p.id}
                    className="text-sm text-white/90 flex items-center gap-2 mb-1"
                  >
                    <FaPhone /> {p.value}
                  </p>
                ))}

                {emails.map((e) => (
                  <p
                    key={e.id}
                    className="text-sm text-white/90 flex items-center gap-2 mb-1"
                  >
                    <FaEnvelope /> {e.value}
                  </p>
                ))}

                <div className="flex gap-4 mt-4">
                  {socials.map((s) => {
                    const kind = s.kind.toLowerCase();
                    const url = s.value.startsWith("http")
                      ? s.value
                      : `https://${s.value}`;

                    const Icon =
                      kind === "facebook"
                        ? FaFacebook
                        : kind === "instagram"
                        ? FaInstagram
                        : FaTiktok;

                    return (
                      <a
                        key={s.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.kind}
                        className="hover:text-emerald-300 transition"
                      >
                        <Icon size={22} />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="text-center text-sm py-4 border-t"
        style={{
          borderColor: "color-mix(in srgb, #ffffff 35%, transparent)"
        }}
      >
        © {new Date().getFullYear()} MUDECOOP R.L. – {t("rights")}
      </div>
    </footer>
  );
}
