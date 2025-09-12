// src/sections/home/AboutMe.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AboutMe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiJDPfimU8Pec9gSRAwK6Gu_FN-ThV5jWXfQ&s",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.div
      id="aboutme"
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
              alt="Historia de Mudecoop"
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
        <h2 className="text-3xl font-bold mb-4">Historia de Mudecoop</h2>

        <p className="text-lg mb-3">
          En el año 2000 se fundó una asociación de mujeres de la zona de
          Manzanillo, Puntarenas llamada <strong>ASOMUPROMA</strong> (Asociación
          de Mujeres por el Progreso de Manzanillo).
        </p>

        <p className="text-lg">
          En el año 2007 se cambió la visión y se fundó la cooperativa{" "}
          <strong>MUDECOOP</strong> (Mujeres de Manzanillo en Desarrollo con su
          Cooperativa) con el objetivo de brindar fuentes de empleo a las
          mujeres de la comunidad.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AboutMe;
