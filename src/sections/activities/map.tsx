// src/sections/home/MapaSection.tsx
"use client";

import { motion } from "framer-motion";

const MapaSection = () => {
  return (
    <motion.section
      id="mapa"
      className="w-full px-3 sm:px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {/* Header - consistente con Activities */}
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-3 sm:px-5 md:px-6 py-3 sm:py-4 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide text-stone-800">
            ¡ENCUÉNTRANOS EN GOOGLE MAPS!
          </h2>
          <div className="mt-3 h-[3px] sm:h-[4px] md:h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>
      </div>

      {/* Mapa */}
      <motion.div
        className="mx-auto mt-6 w-full max-w-6xl"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* En móvil 4:3 para mayor altura, en >=sm 16:9 */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video min-h-[260px]">
            <iframe
              title="Mapa de Manzanillo, Puntarenas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125695.73229049412!2d-84.96769253945047!3d10.09976987631014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9f8be4ded608cf%3A0x89e63cb45dd7f2bd!2sProvincia%20de%20Puntarenas%2C%20Manzanillo!5e0!3m2!1ses-419!2scr!4v1757258847132!5m2!1ses-419!2scr"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Ubicación de Manzanillo, Puntarenas en Google Maps"
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default MapaSection;
