// src/pages/CategoryMenuPage.tsx
import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants, type Transition } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { DATA_MENU } from "../data/datamenu";

// ✅ Easing definido con tipo correcto
const easeBezier: Transition["ease"] = [0.16, 1, 0.3, 1];

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
    show: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: easeBezier, type: "tween" },
    },
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

const NORMATIVAS = [
  "Uso obligatorio de chaleco salvavidas durante traslados.",
  "No correr ni saltar sobre pasarelas o plataformas.",
  "Niños deben estar acompañados por un adulto en todo momento.",
  "Prohibido fumar en áreas no designadas.",
  "Respetar horarios y recomendaciones del personal.",
];

// Variants reutilizables
const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeBezier },
  },
};
const cardIn: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: easeBezier },
  },
};

export default function CategoryMenuPage() {
  const { categoryId = "" } = useParams();
  const navigate = useNavigate();
  const category = useMemo(() => DATA_MENU[categoryId], [categoryId]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleScrollDown = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!category) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-app text-app">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          Categoría no encontrada.
        </motion.p>
        <div className="mt-4 flex justify-center">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
          >
            Volver
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-app text-app">
      {/* Portada */}
      <div
        className="relative w-full h-[50vh] overflow-hidden"
        style={{ backgroundImage: `url(${category.cover})` }}
      >
        <div className="absolute inset-0 bg-center bg-cover" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeBezier }}
            className="max-w-4xl"
          >
            <AnimatedText
              text={category.name}
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

      {/* Contenido */}
      <div ref={listRef} className="px-3 md:px-6 mt-4">
        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={cardIn}
          className="max-w-6xl mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-3 text-center"
        >
          <h2 className="text-base md:text-lg font-extrabold tracking-wide text-app uppercase">
            {category.name}
          </h2>
          <motion.div
            className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A] origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeBezier }}
          />
        </motion.div>

        {/* Ítems */}
        <motion.ul
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-6xl mx-auto mt-6 columns-1 lg:columns-2 gap-12"
        >
          {category.items.map((item) => (
            <motion.li
              key={item.id}
              variants={listItem}
              className="py-3 break-inside-avoid-column"
              whileHover={{ y: -2 }}
              transition={{ type: "tween", ease: easeBezier, duration: 0.25 }}
            >
              <div className="text-[0.95rem] font-semibold text-app">
                {item.name}
              </div>
              <div className="mt-1 flex items-center text-muted">
                <span className="text-sm">{item.description ?? ""}</span>
                <span className="mx-2 flex-1 border-b border-dotted border-[color:color-mix(in srgb,var(--fg) 30%,transparent)] translate-y-[3px]" />
                {item.price && (
                  <span className="text-sm font-semibold text-app">
                    {item.price}
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Normativas */}
        <motion.section
          variants={cardIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-6xl mx-auto mt-8"
        >
          <div className="rounded-lg border border-[color:color-mix(in srgb,var(--fg) 16%,transparent)] bg-card shadow-sm p-4">
            <h3 className="text-sm md:text-base font-bold text-app">
              Normativas del Restaurante Flotante
            </h3>
            <motion.ul
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-3 grid gap-2 text-sm text-app sm:grid-cols-2"
            >
              {NORMATIVAS.map((rule, idx) => (
                <motion.li key={idx} variants={listItem} className="flex gap-2 items-start">
                  <span className="mt-[6px] inline-block size-1.5 rounded-full bg-[#0D784A]" />
                  <span className="text-muted">{rule}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.section>

        {/* Botón gris (sin cambios de color) */}
        <div className="mt-6 mb-10 flex justify-center">
          <motion.button
            type="button"
            onClick={() => navigate("/#menu")}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
          >
            Regresar a categorías
          </motion.button>
        </div>
      </div>
    </section>
  );
}
