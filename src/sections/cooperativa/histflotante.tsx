"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/487712796_1100740478760257_6654084523690400962_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=4IGRVfuqCPQQ7kNvwE5cNH9&_nc_oc=AdmIbBX8rjtIfkwo_aPsfmcjTDYs2mJvGG2jk8oRAUS8fBPUSkXDYgbfh_C4J6OzAWY&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=JRPP-9yvfCTYsfL6g2hmMA&oh=00_Afig9pVTZQTRUy2w8mHAlrRTobNa8BiTNzIGV6KK-Y92Uw&oe=6912A558";
const imgCard2 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/488766362_1104830008351304_1998180963800765163_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Zedt2gRciuQQ7kNvwHFXqdL&_nc_oc=Adm05SpON-E1r-dzpouSc0EASxGmWeaxujSAiOCA4h62GcFZx9i03wmx0hDLdDNHVts&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=7VCDd7CxSJHeyfiTpR5CoQ&oh=00_AfhOtyZ6Lzu9prO3nbr3RfvsR_AbuT3b6_w-hXglMqtJYg&oe=6912B3F6";
const imgForm =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/516218419_1179772384190399_6689040443515843717_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Mt79mfqQLFAQ7kNvwGsOx-t&_nc_oc=Adn3rQ3ZNwqwwus74cmCdEmfDy0i9I881t86gAcDaWNM0ksldSzI7QXJpvBo0Wnp-ws&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=BXPH0z1ngXg9qKsykrjeng&oh=00_AfgjaORGG-kBVzfV6zQo0XdhyanVbTgiW0yfTBvbj4qqLg&oe=6912C594";

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

  // ✅ Solo cambia de imagen si hay más de una
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.article
      className="w-full rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-card text-app dark:border-[color-mix(in_srgb,var(--fg)_20%,transparent)]"
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
              transition={{ duration: images.length > 1 ? 0.6 : 0 }} // 🔹 sin animación si hay una sola imagen
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

/** ---------------------- Vista principal ---------------------- */
export default function HistFlotantePage() {
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
          title="Cómo nació el restaurante flotante"
          paragraphs={[
            "La idea surge en 2021, cuando en gestiones con el INA conocen a José Antonio Lee (Parque Marino). El proyecto estaba dirigido principalmente a pescadores, pero MUDECOOP aplicó y superó los requisitos administrativos y de pólizas.",
            "A inicios de 2023 la cooperativa fue seleccionada, siendo la primera cooperativa de mujeres a nivel nacional en recibir un restaurante flotante.",
            "La construcción inició el 15 de noviembre de 2023; aunque hubo atrasos, el equipo aprovechó para capacitarse y fortalecer el diseño único de la estructura.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 sin animación */}
        <InfoCard
          reverse
          title="Construcción y diseño de la plataforma"
          paragraphs={[
            "Participaron 14 mujeres y 6 hombres: ellas se formaron en fibra de vidrio y ellos en construcción.",
            "El salón principal tiene capacidad para 30–40 personas, con 3 plataformas que soportan hasta 7 toneladas cada una.",
            "Incluye biojardinera para tratar aguas residuales, reduciendo contaminación, y un jardín técnico con servicios sanitarios.",
          ]}
          images={[imgCard2]} // ✅ Solo una imagen, sin animación
        />

        {/* Card 3 */}
        <InfoCard
          title="Operación y futuro compartido"
          paragraphs={[
            "Operación con enfoque comunitario: mujeres en cocina y atención; colaboradores (pescadores) en manejo de pangas y granjas.",
            "La visión es articular con la comunidad para distribuir beneficios y promover el desarrollo local.",
          ]}
          images={[imgCard1]}
        />

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-histflotante"
          className="w-full rounded-xl border border-gray-200 bg-card shadow-sm overflow-hidden text-app"
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
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-app">
                <span className="block">¡Ponte en contacto con nosotros</span>
                <span className="block">para conocer más!</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
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

                {/* Email */}
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

                {/* Actividad */}
                <div>
                  <label htmlFor="actividad" className="block text-sm font-medium text-app">
                    Actividad
                  </label>
                  <input
                    id="actividad"
                    name="actividad"
                    type="text"
                    required
                    placeholder="Ej. Historia restaurante flotante u otra actividad"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                               bg-card text-app placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-sky-500
                               dark:placeholder:text-gray-400
                               dark:border-[color-mix(in_srgb,var(--fg)_25%,transparent)]"
                  />
                </div>

                {/* Mensaje */}
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
        {/* Ícono animado */}
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
