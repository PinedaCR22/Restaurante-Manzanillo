// src/pages/histmudecoop.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Imágenes (reemplaza por las definitivas cuando las tengas)
const imgCard1 =
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1600&auto=format&fit=crop";
const imgCard2 =
  "https://images.unsplash.com/photo-1520975693416-35a0d43390fd?q=80&w=1600&auto=format&fit=crop";
const imgForm =
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop";

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
      className="w-full rounded-xl border border-gray-200 overflow-hidden shadow-sm
                 bg-card text-app 
                 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
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
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-app">{title}</h2>
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

/** ---------------------- Vista principal: HIST. MUDECOOP ---------------------- */
export default function HistMudecoopPage() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-app text-black dark:text-white">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Card 1 — imagen izquierda */}
        <InfoCard
          title="Orígenes: de SUMUPROMA a MUDECOOP"
          paragraphs={[
            "En el año 2000 nace ASOMUPROMA, una asociación de 60 mujeres que se organizaron para crear empleo en un contexto costero con pocas oportunidades laborales para ellas.",
            "Impulsaron proyectos iniciales como hidroponía y la construcción del redondel de Manzanillo, gestionando actividades culturales para generar ingresos.",
            "Tras el fin de concesiones y la salida de muchas socias (2007), ingresó un nuevo grupo que mantuvo viva la organización y, años después, se consolidó la cooperativa: MUDECOOP.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 — imagen derecha */}
        <InfoCard
          reverse
          title="Línea de tiempo: proyectos y aprendizajes"
          paragraphs={[
            "2000–2006: Hidroponía y redondel; organización de turnos y actividades culturales.",
            "2007–2015: Intento de Centro Turístico Verde Mar (bar La Ruana) que no prosperó por limitaciones de crédito y formalización.",
            "2016: Reforestación de manglar junto a Fundación Neotrópica; se estructuran viveros y protocolos de cuidado.",
             "2019: Se fundó la soda Mudecoop, la cual estaría ubicada en las cercanías del malecón de Manzanillo.",
            "2021: Construcción de la panga con acompañamiento del prof. Álvaro (INA), fortaleciendo capacidades técnicas.",
            "Actualidad: Proyección turística y comunitaria desde Manzanillo, preparando nuevas etapas (restaurante flotante en articulación con el parque marino).",
          ]}
          images={[imgCard2, imgCard1]}
        />

        <InfoCard
          title="Organización, ingreso y acciones comunitarias"
          paragraphs={[
            "Ingreso de nuevas socias bajo contrato y período de prueba de 3 meses para asegurar compromiso y buenas prácticas.",
            "Actividades económicas complementarias: venta de comida rápida con horarios extendidos según temporada y carga operativa.",
            "Enfoque comunitario: MUDECOOP Jr donde trabajan en reforestación, educación ambiental y formación en autoestima y autocuidado.",
            "Por la magnitud de los proyectos en curso, la incorporación de nuevas personas está temporalmente cerrada para resguardar recursos y asegurar una implementación responsable.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario (card de tamaño GRANDE) -------- */}
        <motion.article
          id="contacto-histmudecoop"
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
                    placeholder="Historia de MUDECOOP u otra actividad"
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
