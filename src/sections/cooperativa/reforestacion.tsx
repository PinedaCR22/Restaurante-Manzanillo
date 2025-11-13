"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

// IMÁGENES
const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/488224012_1104655355035436_5356683975727891723_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NN9rKLgNrSIQ7kNvwGQaQic&_nc_oc=AdnKahUEo6ps49Q68kS5qEZwGP7rCotMPGTxzB_N1DuDUJmBpO706GfWQCPsIat-Xww&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=YrmMAACIk5hkc-6bzu9iLw&oh=00_Afjv4ejxs6gXvzRKFvrNAbHejvD7DbV238aQkhbYtsE1UQ&oe=6912ABD7";
const imgCard2 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/488255244_1104655181702120_6892800298282702950_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NVSMgDheceYQ7kNvwGRwnKY&_nc_oc=Admwchg6XQCmcGbKOEzuT0RRo_0KZtOBTn2tO_pcgt-VMspui3vwL2y2pub8W0mQ6bY&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=RPeR6CsWX3uQpON7DQObUA&oh=00_Afhe82sY7wernK7yc9YuOc8XHIfFeoFGLGN-2DERrPuzQw&oe=6912B5DA";
const imgForm =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/488662720_1104655415035430_2042049569510802523_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=D4_wi3eeInMQ7kNvwHuN94N&_nc_oc=AdnE3G76z36s2l2cLerJz7RehqTxtb8lit9MV9k7iba52-3gDVywVBQy6Zoeuy2ItoI&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=bS7U4Tv6JdKGM3Gu6tnkDg&oh=00_AfgCpOlP-FoL-lrCOrw0GCdIzYysk0_SEkI0B6fhoJ1ubQ&oe=6912BBA6";

// Claves EmailJS (.env)
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

/** ---------------------- Vista principal: REFORESTACIÓN ---------------------- */
export default function ReforestacionPage() {
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
        <InfoCard
          title="Reforestación comunitaria"
          paragraphs={[
            "Participa en nuestras jornadas de reforestación para restaurar áreas degradadas y fortalecer los corredores biológicos de Manzanillo.",
            "Trabajamos con especies nativas y técnicas sencillas que cualquier persona puede aprender, promoviendo educación ambiental y trabajo en equipo.",
          ]}
          images={[imgCard1]}
        />

        <InfoCard
          reverse
          title="¿Qué incluye y cómo participar?"
          paragraphs={[
            "Incluye inducción de seguridad, materiales básicos (palas, guantes), plantines del vivero y acompañamiento de facilitadoras locales.",
            "Horarios sugeridos: fines de semana por la mañana. Cupo recomendado: hasta 20 personas. Recomendado traer agua, bloqueador y ropa cómoda.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-reforestacion"
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
                    placeholder="Reforestación u otra actividad"
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
