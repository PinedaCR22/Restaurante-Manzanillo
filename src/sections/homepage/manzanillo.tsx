import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function Manzanillo() {
  const { t } = useTranslation("manzanillo");

  // usa las 5 imágenes que pasaste
  const images = [
    "https://www.malpaisbeach.com/wp-content/uploads/2012/06/manzanillo-640px.jpg",
    "https://production-uploads.fastly.propertybase.com/assets/uploads/post/featured_image/56728/1c262a553ba18f575c3b5d341aa83cf9.jpg",
    "https://i.ytimg.com/vi/_CuxsZnmhLg/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgWShUMA8=&rs=AOn4CLA7_9UbdvXwtkD7HCXQ6xDK7Q4KwA",
    "https://mariscossegura.wordpress.com/wp-content/uploads/2013/07/la-costa-_41.jpg",
    "https://i.pinimg.com/736x/a9/42/41/a94241793884ea258f6865acbeee05ae.jpg"
  ];

  // dos pistas idénticas para lograr el bucle perfecto L→R
  const duration = 40; // mayor = más lento

  // Scroll suave hasta el botón "Conocer más"
  const handleScroll = useCallback(() => {
    const el = document.getElementById("manzanillo-btn");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="turismo"
      className="w-full py-10 px-4 md:px-6 scroll-mt-24"
      aria-label={t("aria.section")}
    >
      <div className="relative w-full h-[50vh] overflow-hidden rounded-xl shadow-lg">
        {/* Pista A */}
        <motion.div
          className="absolute inset-y-0 left-0 flex w-[200%]"
          animate={{ x: ["-100%", "0%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          <div className="flex h-full w-[100%]">
            {images.map((src, i) => (
              <img
                key={`a1-${i}`}
                src={src}
                alt={t("alt.image", { index: i + 1 })}
                className="h-full w-auto object-cover select-none pointer-events-none"
                draggable={false}
              />
            ))}
          </div>
          <div className="flex h-full w-[100%]">
            {images.map((src, i) => (
              <img
                key={`a2-${i}`}
                src={src}
                alt={t("alt.duplicate", { index: i + 1 })}
                className="h-full w-auto object-cover select-none pointer-events-none"
                draggable={false}
              />
            ))}
          </div>
        </motion.div>

        {/* Pista B */}
        <motion.div
          className="absolute inset-y-0 left-0 flex w-[200%]"
          animate={{ x: ["-200%", "-100%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          <div className="flex h-full w-[100%]">
            {images.map((src, i) => (
              <img
                key={`b1-${i}`}
                src={src}
                alt={t("alt.image", { index: i + 1 })}
                className="h-full w-auto object-cover select-none pointer-events-none"
                draggable={false}
              />
            ))}
          </div>
          <div className="flex h-full w-[100%]">
            {images.map((src, i) => (
              <img
                key={`b2-${i}`}
                src={src}
                alt={t("alt.duplicate", { index: i + 1 })}
                className="h-full w-auto object-cover select-none pointer-events-none"
                draggable={false}
              />
            ))}
          </div>
        </motion.div>

        {/* Overlay + contenido */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-black/25 border border-white/20 rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <h2 className="text-white text-xl md:text-3xl font-extrabold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
              {t("title.line1")}
            </h2>
            <h2 className="text-white text-xl md:text-3xl font-extrabold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
              {t("title.line2")}
            </h2>
          </motion.div>

          {/* Flecha con scroll */}
          <button
            onClick={handleScroll}
            aria-label={t("aria.scrollDown")}
            className="mt-3 text-white text-2xl"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaArrowDown />
            </motion.div>
          </button>

          {/* Botón */}
          <motion.div
            id="manzanillo-btn"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4"
          >
            <Link
              to="/activities"
              className="rounded-full bg-[#50ABD7]/90 hover:bg-[#3f98c1] text-white px-6 py-2 font-semibold shadow-lg border border-white/30 backdrop-blur-md"
              aria-label={t("aria.cta")}
            >
              {t("cta.more")}
            </Link>
          </motion.div>
        </div>

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25" />
      </div>
    </section>
  );
}
