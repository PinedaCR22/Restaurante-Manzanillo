// src/sections/home/Descriptions.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Descriptions: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://www.malpaisbeach.com/wp-content/uploads/2012/06/manzanillo-640px.jpg",
    "https://i.ytimg.com/vi/_CuxsZnmhLg/maxresdefault.jpg",
    "https://mariscossegura.wordpress.com/wp-content/uploads/2013/07/la-costa-_41.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

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
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt="Comunidad de Manzanillo"
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
        <h2 className="text-3xl font-bold mb-4">
          ¡Bienvenido a la comunidad de Manzanillo, Puntarenas!
        </h2>

        <p className="text-lg">
          Manzanillo es un lugar lleno de tradición, hospitalidad y cultura costera. 
          Su gente impulsa el turismo sostenible y comunitario, compartiendo experiencias 
          auténticas que van desde la pesca artesanal hasta las celebraciones locales. 
          Ven y descubre cómo esta comunidad fortalece sus raíces mientras abre las puertas 
          al mundo.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Descriptions;
