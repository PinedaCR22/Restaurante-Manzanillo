// src/pages/histflotante.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const imgCard1 =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop";
const imgCard2 =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop";
const imgForm =
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop";

/** ---------- Card reutilizable ---------- */
function InfoCard({
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
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.article
      className="w-full rounded-xl border border-gray-200 overflow-hidden shadow-sm
                 bg-card text-app 
                 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Imagen */}
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

        {/* Texto */}
        <div className={`p-6 md:p-8 ${reverse ? "md:order-1" : "md:order-2"} flex items-center`}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-app">
              {title}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base md:text-lg mb-2.5 text-app">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** ---------------------- Vista principal ---------------------- */
export default function HistFlotantePage() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-app text-black dark:text-white">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Card 1 */}
        <InfoCard
          title="Cómo nació el restaurante flotante"
          paragraphs={[
            "La idea surge en 2021, cuando en gestiones con el INA conocen a José Antonio Lee (Parque Marino). El proyecto estaba dirigido principalmente a pescadores, pero MUDECOOP aplicó y superó los requisitos administrativos y de pólizas.",
            "A inicios de 2023 la cooperativa fue seleccionada: la primera cooperativa de mujeres en recibir un restaurante flotante (a Chira se le asignó la 2.ª etapa con granjas y una plataforma de bodega).",
            "La construcción inició el 15 de noviembre de 2023; aunque hubo atrasos por trámites (SICOP), el equipo aprovechó para capacitarse y fortalecer el diseño único de la estructura.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 */}
        <InfoCard
          reverse
          title="Construcción y diseño de la plataforma"
          paragraphs={[
            "Participaron ~14 mujeres y 6 hombres: ellas se formaron en fibra de vidrio y ellos en construcción; el trabajo fue colaborativo y escalonado.",
            "Salón principal de 10×10 m (capacidad práctica 30–40 personas por grupo), con 4 plataformas; la cocina se sostiene en 3 plataformas. Cada plataforma soporta hasta 7 toneladas.",
            "Incluye biojardinera (piedra, arena, botellas y microorganismos) para tratar aguas residuales y grasas, reduciendo contaminación; además, jardín con servicios sanitarios y área técnica.",
            "Se inician 5 granjas: curvina, camarón blanco/yumbo y potencialmente, mejillones y otros moluscos.",
          ]}
          images={[imgCard2, imgCard1]}
        />

        {/* Card 3 */}
        <InfoCard
          title="Operación y futuro compartido"
          paragraphs={[
            "Operación con enfoque comunitario: mujeres en cocina y atención; colaboradores (pescadores) en manejo de pangas, cuidado de granjas y elaboración de alimento para peces/camarón.",
            "La visión no es acaparar tours, sino articular con la comunidad: si una persona con panga cumple requisitos, que ofrezca el tour; promover cabinas y servicios locales para distribuir beneficios.",
          ]}
          images={[imgCard1]}
        />

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-histflotante"
          className="w-full rounded-xl border border-gray-200 bg-card shadow-sm overflow-hidden
                     text-app
                     dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Imagen izquierda */}
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
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-center text-app">
                <span className="block">¡Ponte en contacto con nosotros</span>
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
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-app"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                               bg-card text-app placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-sky-500
                               dark:placeholder:text-gray-400
                               dark:border-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="actividad"
                    className="block text-sm font-medium text-app"
                  >
                    Actividad
                  </label>
                  <input
                    id="actividad"
                    name="actividad"
                    type="text"
                    required
                    placeholder="Historia restaurante flotante u otra actividad"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                               bg-card text-app placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-sky-500
                               dark:placeholder:text-gray-400
                               dark:border-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium text-app"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={8}
                    placeholder="Cuéntanos cuántas personas, fecha deseada y cualquier detalle relevante…"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                               bg-card text-app placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-sky-500
                               dark:placeholder:text-gray-400
                               dark:border-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  />
                </div>

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
                    className="px-6 py-2 rounded-lg bg-[#50ABD7] text-white font-semibold hover:bg-[#3f98c1]
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
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