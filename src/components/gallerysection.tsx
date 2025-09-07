import { useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { GALLERY_IMAGES } from "../data/datagallery";


export default function GallerySection() {
  const handleScroll = useCallback(() => {
    const el = document.getElementById("gallery-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* Hero a media pantalla (50vh) */}
      <section
        className="relative w-full h-[50vh] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')",
        }}
        aria-label="Portada de la galería"
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg">
            ¡Galería de Mudecoop!
          </h1>
          <p className="text-white mt-2 text-base md:text-xl drop-shadow">
            Descubre más de lo que realizamos
          </p>

          <button
            onClick={handleScroll}
            aria-label="Bajar al contenido"
            className="mt-6 flex justify-center w-full text-white text-3xl"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaArrowDown />
            </motion.div>
          </button>
        </div>
      </section>

      {/* Masonry (columns) */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div id="gallery-grid" className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={img.id}
              className="relative overflow-hidden rounded-xl shadow-md break-inside-avoid transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <img
                src={img.src}
                alt={`Imagen ${img.id}`}
                className="w-full object-cover rounded-xl transition duration-300 hover:scale-105 hover:brightness-105"
                style={{ filter: "contrast(1.02) saturate(1.08)" }}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
