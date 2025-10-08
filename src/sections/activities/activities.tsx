// src/sections/home/Activities.tsx
import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ACTIVITIES, type Activity } from "../../data/dataactivities";

type ActivitiesProps = {
  title?: string;
  titleClassName?: string;
  activities?: Activity[];
  onSelectActivity?: (id: string) => void;
};

const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};

const cardV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Activities({
  title = "ACTIVIDADES",
  titleClassName,
  activities,
  onSelectActivity,
}: ActivitiesProps) {
  const data = useMemo(() => activities ?? ACTIVITIES, [activities]);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    onSelectActivity?.(id);
    navigate(`/activities/${id}`);
  };

  if (!data || data.length === 0) {
    return (
      <section id="activities" className="w-full px-3 md:px-6">
        <div className="mx-auto mt-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700">
          No hay actividades para mostrar. Verifica el import de{" "}
          <code>dataactivities.ts</code>.
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="w-full bg-app text-app">
      {/* HEADER (idéntico al estilo del menú) */}
      <div className="px-3 md:px-6">
        <div
          className="
            mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-4 text-center
            dark:bg-[color-mix(in_srgb,var(--card)_90%,black_10%)]
          "
        >
          <h2
            className={clsx(
              "text-xl md:text-2xl font-extrabold tracking-wide text-app",
              titleClassName
            )}
          >
            {title}
          </h2>

          {/* Línea degradada (mismo color que Menu en claro, cambia en dark) */}
          <div
            className="
              mt-3 h-[6px] w-full
              bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]
              dark:from-[#56B5FF] dark:via-[#FFD75E] dark:to-[#2ECC71]
            "
          />
        </div>
      </div>

      {/* GRID */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {data.map((act) => (
            <motion.button
              key={act.id}
              type="button"
              variants={cardV}
              onClick={() => handleClick(act.id)}
              aria-label={`Abrir actividad ${act.name}`}
              className={clsx(
                // contenedor
                "group rounded-xl overflow-hidden border shadow-sm transition hover:shadow-md focus:outline-none",
                // tema claro (original)
                "bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-sky-500",
                // tema oscuro
                "dark:bg-[var(--card)] dark:border-[color-mix(in_srgb,var(--fg)_15%,transparent)] dark:focus-visible:ring-[color-mix(in_srgb,var(--fg)_40%,transparent)]",
                // tamaño
                "w-full md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] justify-self-center"
              )}
            >
              <div className="aspect-[5/3] w-full overflow-hidden bg-gray-100 dark:bg-[color-mix(in_srgb,var(--card)_80%,black_10%)]">
                <img
                  src={act.image || PLACEHOLDER}
                  alt={act.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-2 md:p-3">
                <span
                  className="
                    block rounded-md px-3 py-1 text-center text-[12px] md:text-sm font-semibold uppercase tracking-wide text-white
                    bg-[#50ABD7] group-hover:bg-[#3f98c1]
                    dark:bg-[#56B5FF] dark:group-hover:bg-[#3E9BE0]
                  "
                >
                  {act.name}
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