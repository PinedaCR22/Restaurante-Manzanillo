// src/sections/home/CoperativesServices.tsx
import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type CoopItem = { id: string; name: string; image?: string };

type Props = {
  title?: string;
  titleClassName?: string;
  items?: CoopItem[];
  onSelectItem?: (id: string) => void;
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

// 5 cards exactamente como el mock
const DEFAULT: CoopItem[] = [
  { id: "reforestacion",     name: "REFORESTACIÓN",      image: PLACEHOLDER },
  { id: "mudecoop-jr",       name: "MUDECOOP JR",        image: PLACEHOLDER },
  { id: "tour-de-manglar",   name: "TOUR DE MANGLAR",    image: PLACEHOLDER },
  { id: "hist-mudecoop",     name: "HIST. MUDECOOP",     image: PLACEHOLDER },
  { id: "hist-rest-flotante",name: "HIST. REST FLOTANTE",image: PLACEHOLDER },
];

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function CoperativesServices({
  title = "¡Descubre más sobre nosotras!",
  titleClassName,
  items,
  onSelectItem,
}: Props) {
  const data = useMemo(() => items ?? DEFAULT, [items]);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    onSelectItem?.(id);
    // ajusta esta ruta si ya definiste otra
    navigate(`/coperativeservices/${id}`);
  };

  return (
    <section id="coperativeservices" className="w-full">
      {/* Título + línea degradada */}
      <div className="px-3 md:px-6">
        <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-4 text-center">
          <h2
            className={clsx(
              "text-xl md:text-2xl font-extrabold tracking-wide text-stone-800",
              titleClassName
            )}
          >
            {title}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>
      </div>

      {/* Grid 3x (desktop) con 5 ítems; los de la última fila quedan centrados */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7 justify-items-center">
          {data.map((it) => (
            <motion.button
              key={it.id}
              type="button"
              variants={cardV}
              onClick={() => handleClick(it.id)}
              aria-label={`Abrir ${it.name}`}
              className={clsx(
                "group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden",
                "transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                "w-full md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px]"
              )}
            >
              <div className="aspect-[5/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={it.image || PLACEHOLDER}
                  alt={it.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-2 md:p-3">
                <span className="block rounded-md px-3 py-1 text-center text-[12px] md:text-sm font-semibold text-white uppercase tracking-wide transition-colors bg-[#50ABD7] group-hover:bg-[#3f98c1]">
                  {it.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(CoperativesServices);
