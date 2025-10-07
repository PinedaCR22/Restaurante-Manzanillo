// src/sections/home/Descriptions.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCmsSection, useCmsSelectors } from "../../hooks/public/useCmsPublic";

export default function Descriptions() {
  const { data, loading } = useCmsSection("turismo");
  const { first, getImageUrl } = useCmsSelectors(data ?? null);

  const img = getImageUrl(first);
  const titulo = first?.title ?? "¡Bienvenido a la comunidad de Manzanillo, Puntarenas!";
  const texto =
    first?.body ??
    "Manzanillo es un lugar lleno de tradición, hospitalidad y cultura costera...";

  return (
    <motion.div
      id="descriptions"
      className="w-full flex flex-col md:flex-row items-center py-16 px-8 bg-white text-gray-900 scroll-mt-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Imagen con animación */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-md md:max-w-full overflow-hidden rounded-lg shadow-lg aspect-[2/1]">
          <AnimatePresence mode="wait">
            <motion.img
              key={img || "fallback"}
              src={img || "https://via.placeholder.com/1200x600?text=Turismo"}
              alt={titulo}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Texto */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left px-6 mt-10 md:mt-0"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-4">{titulo}</h2>
        <p className="text-lg whitespace-pre-line">{loading ? "Cargando…" : texto}</p>
      </motion.div>
    </motion.div>
  );
}
