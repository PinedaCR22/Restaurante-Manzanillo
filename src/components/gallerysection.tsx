import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { usePublicGallery } from ".././hooks/public/usePublicGallery";
import { resolveImageUrl } from ".././helpers/media";

type Item = { id: string; src: string };

export default function GallerySection({ galleryId }: { galleryId?: number }) {
  const handleScroll = useCallback(() => {
    const el = document.getElementById("gallery-grid");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Trae la galería pública (primera activa si no pasas id)
  const { images, gallery, loading } = usePublicGallery(galleryId);

  // Normaliza URLs absolutas
  const items: Item[] = useMemo(
    () =>
      images.map((img) => ({
        id: String(img.id),
        src: resolveImageUrl(img.filePath) ?? "",
      })),
    [images]
  );

  // Si no hay imágenes, usa un fondo estático (no datagallery)
  const heroBg =
    items[0]?.src ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

  return (
    <>
      {/* Hero */}
      <section
        className="relative w-full h-[50vh] bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: `url('${heroBg}')` }}
        aria-label="Portada de la galería"
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg">
            {gallery?.title ? `¡${gallery.title}!` : "¡Galería de Mudecoop!"}
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

      {/* Masonry */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div id="gallery-grid" className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {loading && items.length === 0 ? (
            // Skeleton simple
            Array.from({ length: 9 }).map((_, i: number) => (
              <div key={i} className="h-56 w-full bg-slate-200/70 rounded-xl animate-pulse" />
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-500">
              Aún no hay imágenes para mostrar.
            </div>
          ) : (
            items.map((img: Item, index: number) => (
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
            ))
          )}
        </div>
      </section>
    </>
  );
}
