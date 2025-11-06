import { useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants, type Transition } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { useMenu } from "../hooks/public/useMenu";
import { DATA_MENU } from "../data/datamenu";

const easeBezier: Transition["ease"] = [0.16, 1, 0.3, 1];

function AnimatedText({ text, className }: { text: string; className?: string }) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const word: Variants = {
    hidden: { y: 14, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: easeBezier } },
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

const listContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeBezier } },
};
const cardIn: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: easeBezier } },
};

export default function CategoryMenuPage() {
  const { categoryId = "" } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useMenu();
  const listRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Mapeo unificado entre datos del backend y DATA_MENU local
  const category = useMemo(() => {
    // 🔸 Buscar en los datos del backend por ID numérico
    const backend = data?.find((c) => String(c.id) === categoryId);
    if (backend) {
      return {
        id: backend.id,
        name: backend.name,
        cover: backend.imagePath
          ? `${import.meta.env.VITE_API_URL}${backend.imagePath}`
          : "https://via.placeholder.com/1200x500?text=Sin+imagen",
        items: backend.dishes.map((d) => ({
          id: d.id,
          name: d.name,
          price: `₡${Number(d.price).toLocaleString("es-CR")}`,
          description: d.description ?? "",
        })),
      };
    }

    // 🔸 Si no existe en backend, usar datos locales como respaldo
    const local = DATA_MENU[categoryId];
    if (local) {
      return {
        id: local.id,
        name: local.name,
        cover: local.cover,
        items: local.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price ?? "",
          description: i.description ?? "",
        })),
      };
    }

    return null;
  }, [data, categoryId]);

  const handleScrollDown = () => listRef.current?.scrollIntoView({ behavior: "smooth" });

  // ==================== ESTADOS ====================
  if (loading) return <p className="text-center p-10 text-app">Cargando menú...</p>;
  if (error) return <p className="text-center p-10 text-red-600">{error}</p>;
  if (!category)
    return (
      <div className="text-center p-10">
        <p>Categoría no encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
        >
          Volver
        </button>
      </div>
    );

  // ==================== RENDER PRINCIPAL ====================
  return (
    <section className="w-full bg-app text-app">
      {/* Portada */}
      <div
        className="relative w-full h-[50vh] overflow-hidden"
        style={{
          backgroundImage: `url(${category.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeBezier }}
            className="max-w-4xl"
          >
            <AnimatedText
              text={category.name}
              className="block text-3xl md:text-5xl font-extrabold leading-tight uppercase"
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
          viewport={{ once: true }}
          variants={cardIn}
          className="max-w-6xl mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-3 text-center"
        >
          <h2 className="text-base md:text-lg font-extrabold uppercase">{category.name}</h2>
          <motion.div
            className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: easeBezier }}
          />
        </motion.div>

        {/* Ítems */}
        <motion.ul
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          className="max-w-6xl mx-auto mt-6 columns-1 lg:columns-2 gap-12"
        >
          {category.items.length > 0 ? (
            category.items.map((item) => (
              <motion.li
                key={item.id}
                variants={listItem}
                className="py-3 break-inside-avoid-column"
                whileHover={{ y: -2 }}
                transition={{ type: "tween", ease: easeBezier, duration: 0.25 }}
              >
                <div className="text-[0.95rem] font-semibold text-app">{item.name}</div>
                <div className="mt-1 flex items-center text-muted">
                  <span className="text-sm">{item.description}</span>
                  <span className="mx-2 flex-1 border-b border-dotted border-gray-400/50 translate-y-[3px]" />
                  <span className="text-sm font-semibold text-app">{item.price}</span>
                </div>
              </motion.li>
            ))
          ) : (
            <li className="py-6 text-center text-gray-500 italic">
              No hay platillos disponibles por el momento.
            </li>
          )}
        </motion.ul>

        {/* Normativas */}
        <motion.section
          variants={cardIn}
          initial="hidden"
          whileInView="show"
          className="max-w-6xl mx-auto mt-8"
        >
          <div className="rounded-lg border border-gray-300/30 bg-card shadow-sm p-4">
            <h3 className="text-sm md:text-base font-bold text-app">
              Normativas del Restaurante Flotante
            </h3>
            <motion.ul
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              className="mt-3 grid gap-2 text-sm text-app sm:grid-cols-2"
            >
              {NORMATIVAS.map((rule, idx) => (
                <motion.li key={idx} variants={listItem} className="flex gap-2 items-start">
                  <span className="mt-[6px] inline-block size-1.5 rounded-full bg-[#0D784A]" />
                  <span>{rule}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.section>

        {/* Botón Regresar */}
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
