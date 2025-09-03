// src/pages/CategoryMenuPage.tsx
import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { DATA_MENU } from "../data/datamenu";

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
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-center text-stone-700">Categoría no encontrada.</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md bg-[#50ABD7] px-4 py-2 text-white hover:bg-[#3f98c1]"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* ===== Portada: misma imagen del grid, a 50vh en todas las pantallas ===== */}
      <div
        className="relative w-full h-[50vh] overflow-hidden"
        style={{ backgroundImage: `url(${category.cover})` }}
      >
        <div className="absolute inset-0 bg-center bg-cover" />

        {/* Overlays para legibilidad */}
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
              text={category.name}
              className="block text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] uppercase"
              delay={0.15}
              duration={0.45}
            />

            {/* Flecha hacia abajo */}
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

      {/* ===== Lista de ítems ===== */}
      <div ref={listRef} className="px-3 md:px-6 mt-4">
        {/* Franja con línea degradada como separador */}
        <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-3 text-center">
          <h2 className="text-base md:text-lg font-extrabold tracking-wide text-stone-800 uppercase">
            {category.name}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>

        <ul className="max-w-2xl mx-auto mt-4">
          {category.items.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.25 }}
              className="py-3"
            >
              <div className="text-[0.95rem] font-semibold text-stone-800">
                {item.name}
              </div>

              <div className="mt-1 flex items-center text-stone-600">
                <span className="text-sm">{item.description ?? ""}</span>
                <span className="mx-2 flex-1 border-b border-dotted border-stone-300 translate-y-[3px]" />
                {item.price && (
                  <span className="text-sm font-semibold text-stone-800">
                    {item.price}
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 mb-10 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md bg-[#50ABD7] px-4 py-2 text-white hover:bg-[#3f98c1]"
          >
            Volver al menú
          </button>
        </div>
      </div>
    </section>
  );
}
