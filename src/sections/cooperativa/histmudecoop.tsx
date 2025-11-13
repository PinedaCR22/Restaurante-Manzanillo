"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

// Imágenes (ajusta cuando tengas las definitivas)
const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/524399091_1197564192411218_8788740832020901360_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=vgn3yVbxZuEQ7kNvwG0n9Rm&_nc_oc=AdlBLA1fjokd9QkBoQS7tSPuRuIn6PkcjRP56StftJMsSS7QJ-dlaW2gkls0DNY20GA&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=ghm3nVUi0j55fRKErUGJrQ&oh=00_AfiBWM1-GrTG2nT4VNP7sbCgJ2rlRLO6rCoQWNOfaQwMwg&oe=6912B76C";
const imgCard2 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/490662163_1430952898130332_5771740017109492214_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pnFFLyPV7BEQ7kNvwFUExgZ&_nc_oc=AdnnJkfMKQwPnSUStB2801zFhuEOkCWMW48OjzAR0Ey3ZiIvinIbUdvcDUWB39sdy9k&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=yjH34-yzsK80CeCrPi6bBw&oh=00_AfjZlvIC_iMrg1EyeNgxjGBazG3LBxom6NgmAUhiKmPxfg&oe=6912B230";
const imgForm =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/490322912_1430952878130334_7405486593596871068_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=g3D_IdGjgrgQ7kNvwGoPUKK&_nc_oc=AdlCAqSCFGffnNrfndbgbr5BM27LLdJ86J5-8UYKxM-9SRiHsDgZkwbr2TggkuFKtxo&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=hDpvyD9yKHvDvFwn7ludgg&oh=00_AfhTbwA-bgsqduzsFsOAkedA3lq-Q_CqIO49glnQTiDO2A&oe=6912BFD9";

// Claves EmailJS (mismo sistema de variables)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
                 bg-card text-app dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
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
              transition={{ duration: images.length > 1 ? 0.6 : 0 }}
              loading="lazy"
              decoding="async"
            />
          </AnimatePresence>
        </div>

        {/* Texto */}
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

/** ---------------------- Vista principal ---------------------- */
export default function HistMudecoopPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      .then(() => {
        setShowSuccess(true);
        form.reset();
      })
      .catch((err) => {
        console.error("Error al enviar mensaje:", err);
        alert("Ocurrió un error al enviar el mensaje. Intenta nuevamente.");
      });
  };

  return (
    <section className="w-full bg-app text-black dark:text-white">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Card 1 */}
        <InfoCard
          title="Orígenes: de SUMUPROMA a MUDECOOP"
          paragraphs={[
            "En el año 2000 nace ASOMUPROMA, una asociación de 60 mujeres que se organizaron para crear empleo en un contexto costero con pocas oportunidades laborales para ellas.",
            "Impulsaron proyectos iniciales como hidroponía y la construcción del redondel de Manzanillo, gestionando actividades culturales para generar ingresos.",
            "Tras el fin de concesiones y la salida de muchas socias (2007), ingresó un nuevo grupo que mantuvo viva la organización y, años después, se consolidó la cooperativa: MUDECOOP.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 */}
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
          images={[imgCard2]}
        />

        {/* Card 3 */}
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

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-histmudecoop"
          className="w-full rounded-xl border border-gray-200 bg-card shadow-sm overflow-hidden text-app dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            <div className="relative aspect-square md:aspect-auto md:min-h-[460px] lg:min-h-[520px]">
              <img
                src={imgForm}
                alt="Contáctanos"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Form */}
            <div className="p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-app">
                <span className="block">¡Ponte en contacto con nosotros</span>
                <span className="block">para conocer más!</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-app">
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
                  <label htmlFor="email" className="block text-sm font-medium text-app">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Tu correo"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                               bg-card text-app placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-sky-500
                               dark:placeholder:text-gray-400
                               dark:border-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  />
                </div>

                <div>
                  <label htmlFor="actividad" className="block text-sm font-medium text-app">
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
                  <label htmlFor="mensaje" className="block text-sm font-medium text-app">
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
                    className="px-6 py-2 rounded-lg bg-[#50ABD7] text-white font-semibold hover:bg-[#3f98c1]"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.article>

        {/* -------- Modal de Éxito -------- */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm
                         bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border
                           bg-card text-app border-[color-mix(in_srgb,var(--fg)_15%,transparent)]
                           transition-colors duration-300"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="flex justify-center mb-4"
                >
                  <FaCheckCircle className="text-green-500 text-6xl drop-shadow-sm" />
                </motion.div>

                <h3 className="text-2xl font-extrabold mb-2">¡Mensaje enviado con éxito!</h3>
                <p className="text-muted mb-6">
                  Gracias por contactarnos. Te responderemos pronto.
                </p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-6 py-2 rounded-lg bg-[#50ABD7] text-white font-semibold 
                             hover:bg-[#3f98c1] transition duration-200"
                >
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
