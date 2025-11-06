"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

// Imágenes (puedes reemplazarlas luego por las definitivas)
const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/508763208_1165017635665874_7018514102660468598_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=_dPkcC2Tq2IQ7kNvwHfaLPl&_nc_oc=AdlJXMdi9tikwnhJLzL3vB_auzrXcRsRfrY4CE-8NQetTev5WtbeFJ16zeTh0pLpNN0&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=vHMuFBcyceOtzGS_BXnHdQ&oh=00_AfgHRi0mn6IpfgR_OZNta1B-IpA7QSfYifywFTrnhDu8gA&oe=6912CCFA"; // manglar / canales
const imgCard2 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/508885429_1165018288999142_2260684274142399383_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=4H513Khpf0cQ7kNvwECvsPy&_nc_oc=AdlYgHoti2OdwssdXu175BIQ4-AFAIJI2Kc1gvvWpCeUD-QShwNkuGtHYrz_I_5eVqM&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=84Fy3c3_fycJKVPjK_cGoA&oh=00_AfhRIUA1o2RBATzLNO8pVoKEMQW1aCj8EIQzLae0T_1MQw&oe=6912A201"; // fauna/interpretación
const imgForm =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/508496018_1165017938999177_551163357886290106_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-4rwITHWsXAQ7kNvwGGi9IE&_nc_oc=AdmnDZxnV7wyJD7tDRgniFfjgOnuX5pzg-EByyLiwCbaY0dBPuLzC8MlgDjGC391sVs&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=dB87QHfzrd8-Ks1WM0pXDQ&oh=00_AfjE6La6THgocqxDtuXat4FA1vt_Towx-j9IjsVwpLf3JQ&oe=6912AE27"; // dosel de bosque

// Claves EmailJS (mismo sistema de .env)
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
                 bg-card text-app 
                 dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
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

/** ---------------------- Vista principal: TOUR DE MANGLAR ---------------------- */
export default function ManglarPage() {
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
          title="Tour de manglar en Manzanillo"
          paragraphs={[
            "Al llegar, recibirás una bienvenida y una charla introductoria sobre la importancia del ecosistema de manglar y cómo contribuirás durante la visita.",
            "Se entrega el equipo necesario (botas, guantes, bolsas) para la caminata y recolección de residuos. En el área de siembra conocerás los propágulos y el proceso de reforestación.",
            "El proyecto inició en 2016 con Fundación Neotrópica y posteriormente se fortaleció con apoyo técnico de la Alianza de Mujeres de Costa Rica, que capacitó en codificación y cuidado de plántulas.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 */}
        <InfoCard
          reverse
          title="¿Qué incluye y cómo participar?"
          paragraphs={[
            "Incluye charla guiada, equipo básico, acompañamiento de mujeres de la cooperativa y actividades prácticas de recolección, vivero y reforestación.",
            "La experiencia se adapta a grupos estudiantiles, comunitarios o turistas. Se recomienda llevar ropa cómoda, bloqueador, gorra y ropa de cambio.",
            "Los horarios dependen de la marea; se sugiere coordinar entre 8:00 y 16:00 para aprovechar la marea baja y evitar el sol del mediodía.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-manglar"
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

            <div className="p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-center text-app">
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
                    placeholder="Tour de manglar u otra actividad"
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
