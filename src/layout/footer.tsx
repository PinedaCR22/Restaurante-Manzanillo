// src/sections/footer.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

type QuickLink = { key: string; hash: `#${string}` };

const quickLinks: QuickLink[] = [
  { key: "menu",     hash: "#menu" },
  { key: "reservar", hash: "#reservar" },
  { key: "mudecoop", hash: "#mudecoop" },
  { key: "turismo",  hash: "#turismo" }
];

function smoothScrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Footer() {
  const location = useLocation();
  const { t } = useTranslation("footer");
  const { t: tNav } = useTranslation("navbar"); // reutilizamos etiquetas del navbar

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

  return (
    <footer className="bg-brand text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        {/* Logo arriba */}
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

          {/* Columna 3 */}
          <div className="max-w-xs flex flex-col items-center">
            <h2 className="font-semibold mb-3">{t("contactTitle")}</h2>
            <p className="text-sm text-white/90">{t("address")}</p>
            <p className="text-sm text-white/90">
              {t("phoneLabel")}: +506 8800-0312
            </p>
            <p className="text-sm text-white/90 mb-4">
              {t("emailLabel")}: mudecooprl@outlook.com
            </p>

            {/* Íconos redes sociales */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://www.facebook.com/share/1APa66YtqP/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#50ABD7] transition"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/mudecooprl?igsh=MTUzOGFhdXprZ2tuOQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#FBB517] transition"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@mudecoop?_t=ZM-8zoJFky7l5B&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-[#0D784A] transition"
              >
                <FaTiktok size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="text-center text-sm py-4 border-t"
        style={{ borderColor: "color-mix(in srgb, #ffffff 35%, transparent)" }}
      >
        © {new Date().getFullYear()} MUDECOOP R.L. – {t("rights")}
      </div>
    </footer>
  );
}
