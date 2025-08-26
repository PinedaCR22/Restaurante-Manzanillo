// src/pages/reservas.tsx
import { motion } from "framer-motion";

export default function ReservasPage() {
  return (
    <section
      id="reservar"
      className="relative w-full h-[50vh] overflow-hidden scroll-mt-24"
    >
      {/* Imagen de fondo */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/1e/SITIO-EN-CONSTRUCCION.jpg"
        alt="Sección en construcción"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay semitransparente para legibilidad */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Texto centrado */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg text-center"
        >
          Sección de reservaciones en línea en construcción
        </motion.h1>
      </div>
    </section>
  );
}
