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

/** Imagen de respaldo global (si alguna falla en onError) */
const GLOBAL_FALLBACK =
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop";

/** Imágenes reales por defecto (URLs estables) */
const DEFAULT: CoopItem[] = [
  {
    id: "reforestacion",
    name: "REFORESTACIÓN",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "mudecoop-jr",
    name: "MUDECOOP JR",
    image:
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "tour-de-manglar",
    name: "TOUR DE MANGLAR",
    image:
      "https://images.unsplash.com/photo-1517456793572-97f240c05be8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "hist-mudecoop",
    name: "HIST. MUDECOOP",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "hist-rest-flotante",
    name: "HIST. REST FLOTANTE",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
];

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

/** Layout “3 arriba / 2 abajo en las calles” */
function layoutClasses(index: number, lastIndex: number) {
  const base =
    "group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

  const mobile = index === lastIndex ? "col-span-2" : "col-span-1";

  let desktop = "md:col-span-2";
  if (index === 0) desktop += " md:col-start-1";
  else if (index === 1) desktop += " md:col-start-3";
  else if (index === 2) desktop += " md:col-start-5";
  else if (index === 3) desktop += " md:col-start-2";
  else if (index === 4) desktop += " md:col-start-4";

  return clsx(base, mobile, desktop, "w-full justify-self-center");
}

function aspectClasses(index: number, lastIndex: number) {
  return clsx(
    "w-full overflow-hidden bg-gray-100",
    index === lastIndex ? "aspect-[16/7] md:aspect-[5/3]" : "aspect-[5/3]"
  );
}

/** Fallback de imagen: si falla, usar GLOBAL_FALLBACK y desactivar onError para evitar loop */
function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== GLOBAL_FALLBACK) {
    img.src = GLOBAL_FALLBACK;
    img.onerror = null;
  }
}

function CoperativesServices({
  title = "¡Descubre más sobre nosotras!",
  titleClassName,
  items,
  onSelectItem,
}: Props) {
  // Si te pasan items sin image, rellenamos con las de DEFAULT por índice
  const data = useMemo(() => {
    const base = items && items.length ? items : DEFAULT;
    return base.map((it, i) => ({
      ...it,
      image: it.image || DEFAULT[i % DEFAULT.length].image,
    }));
  }, [items]);

  const navigate = useNavigate();
  const lastIndex = data.length - 1;

  const handleClick = (id: string) => {
    onSelectItem?.(id);
    // ✅ ruta corregida
    navigate(`/cooperativa/${id}`);
  };

  return (
    <section id="cooperativa" className="w-full">
      {/* Header (mismo estilo de títulos con línea) */}
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

      {/* Grid con “calles” */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-5 md:gap-7">
          {data.map((it, i) => (
            <motion.button
              key={it.id}
              type="button"
              variants={cardV}
              onClick={() => handleClick(it.id)}
              aria-label={`Abrir ${it.name}`}
              className={layoutClasses(i, lastIndex)}
            >
              <div className={aspectClasses(i, lastIndex)}>
                <img
                  src={it.image!}
                  alt={it.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImgError}
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
