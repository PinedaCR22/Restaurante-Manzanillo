"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/502417486_1152384080262563_9048445433835063258_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8Hx-lc81TOwQ7kNvwHfBj3P&_nc_oc=AdlYh26h-yS31C2lVpooisqCwclFrHg3KbHIty6YWOMv34i3dr6UalMld0HzT7JgRAQ&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=YJ2nuHfCmRJKtRxBQ4g2-g&oh=00_Afh59JsMuW2uAMrn7voYZaX5wICxwhxpnib-k4r0Dymyxg&oe=6912AC20";
const imgCard2 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/531994095_1211826490984988_4865422851711722006_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Byo2jgWvOl0Q7kNvwF7fzpT&_nc_oc=Adn3EmKIzg1cCsW7Dbd3s0A6HK4fjMDZk8djM4XIrPuw8jQyShvlU8WraYW93mULkiE&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=OFU05C9RRhqOI94-P2wIQA&oh=00_AfipBSwQ1pUlz3FkqB3oAxDUF9QGVdHT6_rzhfpgkGXV6w&oe=69129DB3";
const imgForm =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/530760563_1211826634318307_1459505565136447529_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ZBTzcSBxWpsQ7kNvwGRBq-1&_nc_oc=Adlm-Bv_I9peEKaQZdExMRcE2f4RoKiOo71WeEep8_F35ZZlv1QtSA9nfmqVi3Lu1jY&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=Gqz801CNeCp5LGCos0ew0Q&oh=00_AfgN6nGXweS_hGt3Jz8yNKBwGvr1CCoLBehfJ4uP6pfHiw&oe=6912C6C3";

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

/** ---------------------- Vista principal MUDECOOP JR ---------------------- */
export default function MudecoopJRPage() {
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
          title="MUDECOOP JR: origen e identidad"
          paragraphs={[
            "Nace para incluir a niñas y niños de Manzanillo en actividades comunitarias con foco ambiental y valores de liderazgo.",
            "Tras una primera convocatoria, quedaron 20 niñas y se consolidó el nombre MUDECOOP JR.",
            "Gracias a la gestión vinculada a “Mujeres de Manglar” se obtuvo apoyo para alimentación, hidratación y equipo en cada jornada.",
            "Coordinación: Maritza Obando, Allison Sánchez y Ana Cecilia (alimentación). Todas las participantes son de Manzanillo y alrededores.",
          ]}
          images={[imgCard1]}
        />

        <InfoCard
          reverse
          title="Actividades que realizan"
          paragraphs={[
            "Actividades: recolección de propágulos, vivero y reforestación en un área exclusiva de MUDECOOP JR; educación sobre la importancia del manglar.",
            "Formación personal: autoestima, autocuidado y trabajo en equipo. Actividades recreativas como fútbol, voleibol y pintura, además de celebraciones puntuales.",
            "Frecuencia: una vez al mes. Cupo: 20 niñas, organizadas en dos grupos de 10 para mejor acompañamiento.",
            "Logística: se proveen equipo básico, hidratación y alimentación durante las jornadas.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario -------- */}
        <motion.article
          id="contacto-mudecoopjr"
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
                    placeholder="¿Sobre qué actividad consultas?"
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
                    placeholder="Cuéntanos más…"
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
