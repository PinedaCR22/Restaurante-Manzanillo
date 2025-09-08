// src/pages/histmudecoop.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Imágenes (reemplaza por las definitivas cuando las tengas)
const imgCard1 =
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1600&auto=format&fit=crop"; // comunidad / reunión
const imgCard2 =
  "https://images.unsplash.com/photo-1520975693416-35a0d43390fd?q=80&w=1600&auto=format&fit=crop"; // archivo / notas / historia
const imgForm =
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop"; // costa / muelle de Manzanillo

/** ---------- Card reutilizable (compacto tipo AboutMe) ---------- */
function InfoCard({
  title,
  paragraphs,
  images,
  reverse = false,
}: {
  title: string;
  paragraphs: string[];
  images: string[];
  reverse?: boolean; // false = imagen izquierda, true = imagen derecha
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.article
      className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Imagen (altura compacta en desktop) */}
        <div
          className={`relative ${reverse ? "md:order-2" : "md:order-1"} 
                      aspect-square md:aspect-[16/9] md:min-h-[300px] lg:min-h-[340px]`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>
        </div>

        {/* Texto (padding compacto) */}
        <div className={`p-6 md:p-8 ${reverse ? "md:order-1" : "md:order-2"} flex items-center`}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base md:text-lg mb-2.5 text-gray-800">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** ---------------------- Vista principal: HIST. MUDECOOP ---------------------- */
export default function HistMudecoopPage() {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      {/* Ancho completo sin max-w */}
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Card 1 — imagen izquierda */}
        <InfoCard
          title="Historia de MUDECOOP"
          paragraphs={[
            "Conoce los orígenes de MUDECOOP: desde las primeras iniciativas de organización de mujeres en Manzanillo hasta la consolidación de la cooperativa.",
            "Repasamos hitos, desafíos y logros que impulsaron empleo local, liderazgo femenino y proyectos de impacto comunitario.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 — imagen derecha */}
        <InfoCard
          reverse
          title="Recuerdos, voces y aprendizajes"
          paragraphs={[
            "La visita integra relatos orales, material fotográfico y testimonios de socias fundadoras para comprender la evolución de la cooperativa.",
            "Profundizamos en el modelo solidario, la participación intergeneracional y el enfoque de sostenibilidad aplicado en la comunidad.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario (card de tamaño GRANDE como acordamos) -------- */}
        <motion.article
          id="contacto-histmudecoop"
          className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Imagen izquierda: alturas grandes */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[460px] lg:min-h-[520px]">
              <img
                src={imgForm}
                alt="Contáctanos"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Form derecha */}
            <div className="p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-center">
                <span className="block">¡ponte en contacto con nosotros</span>
                <span className="block">para conocer más!</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("¡Gracias por contactarnos! Te escribiremos pronto.");
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
                    placeholder="Historia de MUDECOOP u otra actividad"
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
                    rows={8}
                    placeholder="Cuéntanos cuántas personas, fecha deseada y cualquier detalle relevante…"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Botones a la derecha: Regresar (izq) + Enviar (der) */}
                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/cooperativa")}
                    className="px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#50ABD7] text-white font-semibold hover:bg-[#3f98c1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
