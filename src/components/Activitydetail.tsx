// src/components/Activitydetail.tsx 
import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { ACTIVITIES } from "../data/dataactivities";
import { ACTIVITY_DETAILS } from "../data/activityDetails"; // 👈 NUEVO IMPORT

const FALLBACK_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

function AnimatedText({
  text,
  className,
  delay = 0.1,
  duration = 0.5,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: 14, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration, ease: [0.16, 1, 0.3, 1], type: "tween" } },
  };
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={word} className="inline-block mr-2">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

type Section =
  | { key: "desc"; title: string; image: string; body: string }
  | { key: "incluye"; title: string; image: string; items: string[] }
  | { key: "contacto"; title: string; image: string; items: string[] };

export default function ActivityDetailPage() {
  const { activityId = "" } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const activity = useMemo(
    () => ACTIVITIES.find((a) => a.id === activityId),
    [activityId]
  );

  // 👇 OBTENER DETALLE REAL
  const detail = ACTIVITY_DETAILS[activityId];

  // 👇 ARMAR SECCIONES DESDE EL DATA
  const sections: Section[] = useMemo(() => {
    if (!detail) return [];
    const cover = detail.cover || FALLBACK_IMG;

    const horariosLine =
      detail.schedules.length > 0
        ? `Horarios: ${detail.schedules.map((s) => `${s.day} ${s.hours}`).join(" · ")}.`
        : "Horarios: por confirmar.";

    const contactos =
      detail.contacts.length > 0
        ? detail.contacts.map((c) => `${c.label}: ${c.value}`)
        : ["Sin contactos disponibles por ahora."];

    return [
      { key: "desc", title: "Descripción", image: cover, body: detail.description },
      {
        key: "incluye",
        title: "¿Qué incluye y horarios?",
        image: cover,
        items: [...detail.includes, horariosLine],
      },
      { key: "contacto", title: "Contacto y reservas", image: cover, items: contactos },
    ];
  }, [detail]);

  const handleScrollDown = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!activity || !detail) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-center text-stone-700">Actividad no encontrada.</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/activities")
            }
            className="rounded-md bg-[#50ABD7] px-4 py-2 text-white hover:bg-[#3f98c1]"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // 👇 USAR TÍTULO Y COVER DEL DETALLE (con fallback)
  const title = detail.title || activity.name;
  const cover = detail.cover || activity.image || FALLBACK_IMG;

  return (
    <section className="w-full">
      {/* ====== Portada 50vh ====== */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${cover})` }}
          role="img"
          aria-label={title}
        />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Título centrado + flecha */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <AnimatedText
              text={title}
              className="block text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] uppercase"
              delay={0.15}
              duration={0.45}
            />
            <button
              onClick={handleScrollDown}
              aria-label="Bajar al contenido"
              className="mt-6 flex justify-center w-full text-white text-3xl"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaArrowDown />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ====== Contenido ====== */}
      <div ref={contentRef} className="px-3 md:px-6 mt-4">
        {/* Franja/separador con línea degradada */}
        <div
          className="
            mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-3 text-center
            border dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)] text-app
          "
        >
          <h2 className="text-base md:text-lg font-extrabold tracking-wide uppercase text-app">
            {title}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>

        {/* ===== 3 Secciones con imagen alternada ===== */}
        <div className="max-w-6xl mx-auto mt-6 space-y-6">
          {sections.map((sec, idx) => {
            const reverse = idx % 2 === 1; // alterna L⇄R
            return (
              <motion.article
                key={sec.key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25 }}
                className="
                  grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch
                  rounded-xl border overflow-hidden shadow-sm md:min-h-[280px] lg:min-h-[320px]
                  bg-card text-app
                  border-gray-200 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]
                "
              >
                {/* Imagen */}
                <div
                  className={`relative h-48 md:h-auto ${reverse ? "md:order-2" : "md:order-1"}`}
                >
                  <img
                    src={(sec as any).image || FALLBACK_IMG}
                    alt={sec.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Contenido */}
                <div className={`p-4 md:p-6 flex ${reverse ? "md:order-1" : "md:order-2"} bg-card`}>
                  <div className="my-auto w-full">
                    <h3 className="text-lg md:text-xl font-bold text-app">{sec.title}</h3>
                    <div className="mt-2 text-sm md:text-base leading-relaxed text-app">
                      {sec.key === "desc" && "body" in sec && <p>{sec.body}</p>}

                      {sec.key !== "desc" && "items" in sec && (
                        <ul className="list-disc ml-5 space-y-1">
                          {sec.items.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Botón final */}
        <div className="mt-8 mb-12 flex justify-center">
          <motion.button
            type="button"
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/activities")
            }
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
          >
            Volver a actividades
          </motion.button>
        </div>
      </div>
    </section>
  );
}
