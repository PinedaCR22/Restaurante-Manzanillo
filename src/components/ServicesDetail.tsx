// src/sections/home/ServicesShowcase.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const img1 =
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop";
const img2 =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop";
const imgForm =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

function Card({
  title,
  paragraphs,
  images,
  reverse = false,
}: {
  title: string;
  paragraphs: string[];
  images: string[];
  reverse?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(
      () => setCurrentIndex((p) => (p + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.div
      className={`w-full flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center py-16 px-8 bg-white text-gray-900`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Imagen */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-md md:max-w-full overflow-hidden rounded-lg shadow-lg aspect-[2/1]">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Texto */}
      <motion.div
        className={`w-full md:w-1/2 flex flex-col justify-center text-center md:text-left px-6 mt-10 md:mt-0`}
        initial={{ opacity: 0, x: reverse ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-lg mb-3">
            {p}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function ServicesShowcase() {
  return (
    <section id="services-showcase" className="scroll-mt-24">
      {/* Card 1 – imagen izquierda */}
      <Card
        title="Servicio destacado #1"
        paragraphs={[
          "Este es un texto genérico para describir el primer servicio. Ideal para introducir beneficios, impacto y propósito.",
          "Puedes añadir aquí datos clave como duración, público meta y resultados esperados.",
        ]}
        images={[img1]}
      />

      {/* Card 2 – imagen derecha */}
      <Card
        reverse
        title="Servicio destacado #2"
        paragraphs={[
          "Descripción genérica del segundo servicio. Enfatiza valor comunitario, sostenibilidad y aprendizaje.",
          "Incluye una línea sobre la experiencia práctica y el acompañamiento del equipo.",
        ]}
        images={[img2]}
      />

      {/* Formulario de contacto con imagen a la izquierda */}
      <motion.div
        id="contacto-servicios"
        className="w-full flex flex-col md:flex-row items-center py-16 px-8 bg-white text-gray-900"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Imagen */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-md md:max-w-full overflow-hidden rounded-lg shadow-lg aspect-[2/1]">
            <img
              src={imgForm}
              alt="Contáctanos"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Formulario */}
        <motion.div
          className="w-full md:w-1/2 px-6 mt-10 md:mt-0"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            ponte en contacto con nosotros para conocer más
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Aquí puedes manejar el submit (fetch/axios) o levantar prop
              alert("¡Gracias por escribirnos! Te contactaremos pronto.");
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Tu nombre"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label htmlFor="actividad" className="block text-sm font-medium text-gray-700">
                Actividad
              </label>
              <input
                id="actividad"
                name="actividad"
                type="text"
                required
                placeholder="¿Sobre qué actividad consultas?"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="Cuéntanos más…"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[#50ABD7] px-6 py-2.5 font-semibold text-white hover:bg-[#3f98c1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}
