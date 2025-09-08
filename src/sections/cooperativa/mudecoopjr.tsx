// src/pages/mudecoopjr.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const imgCard1 =
  "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/516498648_1179772304190407_6105943606169912598_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=-nq9Alhe-l8Q7kNvwFpJKC9&_nc_oc=AdkMvuAHMBwvxMRroaZgy2hiIdqLkGgpMAbX2nLG7WhY4e87rZPAfIXrcHa_xmS6hwQ&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=mKMF7HusHz5GFSCZqE-zzg&oh=00_AfWSVkkLdbEaZvonVuRruRC4q37vESdY3hDE6qdS7EV8UQ&oe=68B2C4CF";
const imgCard2 =
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop";
const imgForm =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

/** ---------- Card reutilizable (más compacto) ---------- */
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
        {/* Imagen (más baja en desktop) */}
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

/** ---------------------- Vista principal MUDECOOP JR ---------------------- */
export default function MudecoopJRPage() {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      {/* Ancho completo sin max-w */}
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* Card 1 — imagen izquierda */}
        <InfoCard
          title="Historia de MUDECOOP JR"
          paragraphs={[
            "MUDECOOP JR promueve la participación de la niñez y juventud en actividades comunitarias con enfoque en liderazgo, cultura y sostenibilidad.",
            "A través de talleres y experiencias guiadas, buscamos formar valores de cooperación y pertenencia a la comunidad.",
          ]}
          images={[imgCard1]}
        />

        {/* Card 2 — imagen derecha */}
        <InfoCard
          reverse
          title="¿Qué incluye y cómo participar?"
          paragraphs={[
            "Talleres educativos y culturales, dinámicas recreativas y acompañamiento de instructores locales.",
            "Sesiones regulares los sábados de 9:00 a 13:00. Cupo limitado a 20 participantes por grupo.",
          ]}
          images={[imgCard2]}
        />

        {/* -------- Formulario (card único y más compacto) -------- */}
        {/* -------- Formulario (card con tamaño anterior) -------- */}
<motion.article
  id="contacto-mudecoopjr"
  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
    {/* Imagen izquierda: tamaños anteriores */}
    <div className="relative aspect-square md:aspect-auto md:min-h-[460px] lg:min-h-[520px]">
      <img
        src={imgForm}
        alt="Contáctanos"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>

    {/* Form derecha (título centrado y botones a la derecha: Regresar, Enviar) */}
    <div className="p-6 md:p-10">
      <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-center">
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
            rows={8}
            placeholder="Cuéntanos más…"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
