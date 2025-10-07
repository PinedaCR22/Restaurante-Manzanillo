import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublicGallery } from "../../hooks/public/usePublicGallery";
import { resolveImageUrl } from "../../helpers/media";

type PreviewItem = { id: string; src: string };

export default function Gallery() {
  // Primera galería activa (o pasa un ID: usePublicGallery(id))
  const { images, gallery, loading } = usePublicGallery();

  // Top-8 para el preview
  const items: PreviewItem[] = images
    .slice(0, 8)
    .map((img) => ({ id: String(img.id), src: resolveImageUrl(img.filePath) ?? "" }));

  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-stone-800">
            {gallery?.title ?? "¡Nuestra galería!"}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center text-slate-500">Cargando…</div>
        )}

        {/* Masonry */}
        {!loading && items.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            Aún no hay imágenes para mostrar.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 mb-12 mt-6">
            {items.map((img: PreviewItem, index: number) => (
              <motion.div
                key={img.id}
                className="relative overflow-hidden rounded-xl shadow-md break-inside-avoid transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <img
                  src={img.src}
                  alt={`Imagen ${img.id}`}
                  className="w-full object-cover rounded-xl transition duration-300 hover:scale-105 hover:brightness-105"
                  style={{ filter: "contrast(1.02) saturate(1.1)" }}
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Botón */}
        <div className="text-center">
          <Link to="/galeria" className="inline-block">
            <button className="px-5 py-2 bg-[#50ABD7] text-white rounded hover:bg-[#3f98c1] transition">
              Ver más
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
