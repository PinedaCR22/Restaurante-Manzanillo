// src/sections/activities/Activities.tsx
import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTourismActivities } from "../../hooks/public/useTourism";
import type { TourismActivity } from "../../types/activity/TourismActivity";

const PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

/* ---------------------------------------------------------
   🎞️ Animaciones
--------------------------------------------------------- */
const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};
const cardV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ---------------------------------------------------------
   🎯 Componente principal
--------------------------------------------------------- */
function Activities() {
  const { activities, loading, error } = useTourismActivities();
  const navigate = useNavigate();

  if (loading)
    return (
      <p className="text-center mt-8 text-gray-600">Cargando actividades...</p>
    );

  if (error)
    return (
      <div className="mx-auto mt-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
        {error}
      </div>
    );

  if (!activities || activities.length === 0)
    return (
      <div className="mx-auto mt-6 text-center text-gray-600">
        No hay actividades disponibles.
      </div>
    );

  return (
    <section id="activities" className="w-full bg-app text-app">
      {/* ====== HEADER ====== */}
      <div className="px-3 md:px-6">
        <div
          className="
            mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-4 text-center
            dark:bg-[color-mix(in_srgb,var(--card)_90%,black_10%)]
          "
        >
          <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-app">
            ACTIVIDADES
          </h2>

          {/* Línea degradada igual al home */}
          <div
            className="
              mt-3 h-[6px] w-full
              bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]
              dark:from-[#56B5FF] dark:via-[#FFD75E] dark:to-[#2ECC71]
            "
          />
        </div>
      </div>

      {/* ====== GRID ====== */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {activities.map((act: TourismActivity) => (
            <motion.button
              key={act.id}
              type="button"
              variants={cardV}
              onClick={() => navigate(`/activities/${act.id}`)}
              aria-label={`Abrir actividad ${act.title}`}
              className="
                group rounded-xl overflow-hidden border shadow-sm transition hover:shadow-md focus:outline-none
                bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-sky-500
                dark:bg-[var(--card)] dark:border-[color-mix(in_srgb,var(--fg)_15%,transparent)]
                dark:focus-visible:ring-[color-mix(in_srgb,var(--fg)_40%,transparent)]
                w-full md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] justify-self-center
              "
            >
              {/* Imagen */}
              <div className="aspect-[5/3] w-full overflow-hidden bg-gray-100 dark:bg-[color-mix(in_srgb,var(--card)_80%,black_10%)]">
                <img
  src={
    act.image_path
      ? act.image_path.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : PLACEHOLDER
  }
  alt={act.title}
  loading="lazy"
  decoding="async"
  referrerPolicy="no-referrer"
  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
/>

              </div>

              {/* Título */}
              <div className="p-2 md:p-3">
                <span
                  className="
                    block rounded-md px-3 py-1 text-center text-[12px] md:text-sm font-semibold uppercase tracking-wide text-white
                    bg-[#50ABD7] group-hover:bg-[#3f98c1]
                    dark:bg-[#56B5FF] dark:group-hover:bg-[#3E9BE0]
                  "
                >
                  {act.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(Activities);
