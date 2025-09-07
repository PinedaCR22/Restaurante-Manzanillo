// src/sections/home/MapaSection.tsx
import { motion } from "framer-motion";

const MapaSection = () => {
  return (
    <motion.section
      id="mapa"
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Header con mismo estilo que Activities */}
      <div className="px-3 md:px-6">
        <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-4 text-center w-full">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-stone-800">
            ¡ENCUÉNTRANOS EN GOOGLE MAPS!
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>
      </div>

      {/* Mapa centrado con el mismo ancho que antes */}
      <motion.div
        className="mt-6 w-full"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125695.73229049412!2d-84.96769253945047!3d10.09976987631014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9f8be4ded608cf%3A0x89e63cb45dd7f2bd!2sProvincia%20de%20Puntarenas%2C%20Manzanillo!5e0!3m2!1ses-419!2scr!4v1757258847132!5m2!1ses-419!2scr"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Manzanillo, Puntarenas"
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default MapaSection;
