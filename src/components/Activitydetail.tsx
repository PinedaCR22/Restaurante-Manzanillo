import React, { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { useTourismDetail } from "../hooks/public/useTourismDetail";

const FALLBACK_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

/* ---------------------------------------------------------
   🧩 Subcomponente: Texto animado
--------------------------------------------------------- */
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

function AnimatedText({
  text,
  className,
  delay = 0.1,
  duration = 0.5,
}: AnimatedTextProps) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: 14, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
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

/* ---------------------------------------------------------
   🏝️ Tipos ajustados
--------------------------------------------------------- */
export interface ActivityBlock {
  id?: number;
  title?: string | null;
  body?: string | null;
  image_path?: string | null;
}

/* ---------------------------------------------------------
   🏝️ Página principal del detalle de actividad
--------------------------------------------------------- */
export default function ActivityDetailPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  // ✅ Validación y conversión segura del ID
  const parsedId = React.useMemo(() => {
    if (!activityId) return undefined;
    const trimmed = activityId.trim();
    if (!/^[0-9]+$/.test(trimmed)) return undefined;
    const num = parseInt(trimmed, 10);
    return num > 0 ? num : undefined;
  }, [activityId]);

  // ✅ Hook del backend
  const { activity, loading, error } = useTourismDetail(parsedId);

  const cover = activity?.image_path || FALLBACK_IMG;
  const title = activity?.title || "Actividad";

  const schedulesText = activity?.include_schedule_text || null;
  const contacts = [
    activity?.contact_email && `Correo: ${activity.contact_email}`,
    activity?.contact_phone && `Teléfono: ${activity.contact_phone}`,
    activity?.contact_note && `Nota: ${activity.contact_note}`,
  ].filter(Boolean) as string[];

  // ✅ Tipado seguro de los bloques
  const blocks: ActivityBlock[] =
    Array.isArray(activity?.blocks)
      ? activity.blocks.map((block): ActivityBlock => ({
          id: block?.id,
          title: block?.title ?? null,
          body: block?.body ?? null,
          image_path: block?.image_path ?? null,
        }))
      : [];

  // ✅ Secciones principales (solo mostrar si tienen contenido REAL)
  const sections = useMemo<
    Array<
      | { key: string; title: string; image: string; body: string }
      | { key: string; title: string; image: string; items: string[] }
    >
  >(() => {
    if (!activity) return [];
    
    const allSections = [];
    
    // Solo agregar descripción si existe
    if (activity.description) {
      allSections.push({
        key: "desc",
        title: "Descripción",
        image: cover,
        body: activity.description,
      });
    }
    
    // Solo agregar horarios si existe
    if (schedulesText) {
      allSections.push({
        key: "incluye",
        title: "¿Qué incluye y horarios?",
        image: cover,
        items: [schedulesText],
      });
    }
    
    // Solo agregar contacto si hay al menos un dato de contacto
    if (contacts.length > 0) {
      allSections.push({
        key: "contacto",
        title: "Contacto y reservas",
        image: cover,
        items: contacts,
      });
    }
    
    return allSections;
  }, [activity, cover, schedulesText, contacts]);

  const handleScrollDown = () =>
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* ---------------------------------------------------------
     🎨 Render
  --------------------------------------------------------- */
  if (loading)
    return <p className="text-center mt-8 text-gray-600">Cargando actividad...</p>;

  if (error || !activity)
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-red-600">
        {error ?? "Actividad no encontrada."}
        <div className="mt-4">
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

  return (
    <section className="w-full">
      {/* ====== Portada ====== */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
  backgroundImage: `url(${
    cover
      ? cover.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : FALLBACK_IMG
  })`,
}}

          role="img"
          aria-label={title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-black/10" />

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
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaArrowDown />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ====== Contenido ====== */}
      <div ref={contentRef} className="px-3 md:px-6 mt-4">
        {/* Cabecera */}
        <div className="mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-3 text-center border dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)] text-app">
          <h2 className="text-base md:text-lg font-extrabold tracking-wide uppercase text-app">
            {title}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>

        {/* Secciones principales */}
        <div className="max-w-6xl mx-auto mt-6 space-y-6">
          {sections.map((sec, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <motion.article
                key={sec.key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch rounded-xl border overflow-hidden shadow-sm md:min-h-[280px] lg:min-h-[320px] bg-card text-app border-gray-200 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
              >
                <div
                  className={`relative h-48 md:h-auto ${
                    reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <img
  src={
    sec.image
      ? sec.image.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : FALLBACK_IMG
  }
  alt={sec.title}
  className="absolute inset-0 h-full w-full object-cover"
  loading="lazy"
/>

                </div>

                <div
                  className={`p-4 md:p-6 flex ${
                    reverse ? "md:order-1" : "md:order-2"
                  } bg-card`}
                >
                  <div className="my-auto w-full">
                    <h3 className="text-lg md:text-xl font-bold text-app">{sec.title}</h3>
                    <div className="mt-2 text-sm md:text-base leading-relaxed text-app">
                      {"body" in sec && sec.body && <p>{sec.body}</p>}
                      {"items" in sec && sec.items && (
                        <ul className="list-disc ml-5 space-y-1">
                          {sec.items.map((t: string, i: number) => (
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

          {/* Bloques dinámicos */}
          {blocks.map((block, idx) => {
            const reverse = idx % 2 === 0;
            return (
              <motion.article
                key={block.id ?? idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch rounded-xl border overflow-hidden shadow-sm bg-card text-app border-gray-200 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
              >
                <div
                  className={`relative h-48 md:h-auto ${
                    reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
<img
  src={
    block.image_path
      ? block.image_path.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : FALLBACK_IMG
  }
  alt={block.title ?? "Bloque"}
  className="absolute inset-0 h-full w-full object-cover"
/>

                </div>
                <div
                  className={`p-4 md:p-6 flex ${
                    reverse ? "md:order-1" : "md:order-2"
                  } bg-card`}
                >
                  <div className="my-auto w-full">
                    <h3 className="text-lg md:text-xl font-bold text-app">
                      {block.title ?? "Sección adicional"}
                    </h3>
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-app">
                      {block.body ?? "Sin contenido disponible."}
                    </p>
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