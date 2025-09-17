// src/sections/home/Mudecoop.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Mudecoop: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiJDPfimU8Pec9gSRAwK6Gu_FN-ThV5jWXfQ&s"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.div
      id="mudecoop"
      className="w-full flex flex-col md:flex-row items-center py-16 px-8 bg-white text-gray-900 scroll-mt-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Imagen fija horizontal */}
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
              alt="Mudecoop"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Texto + botón */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left px-6 mt-10 md:mt-0"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-2">
          ¡Este restaurante fue posible gracias a la mano de obra de Mudecoop R.L!
        </h2>
        {/* Línea degradada */}
        <div className="mb-4 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />

        <p className="text-lg mb-6">
          MUDECOOP promueve el desarrollo cooperativo y comunitario, conectando a los visitantes
          con iniciativas locales que impulsan el bienestar social. Descubre nuestros programas, experiencias y cómo puedes formar parte.
        </p>

        <button
          onClick={() => navigate("/cooperativa")}
          className="self-center md:self-start bg-[#50ABD7] hover:bg-[#3f98c1] text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
        >
          Conocer más
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Mudecoop;
