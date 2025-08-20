import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

type HeroProps = {
  images?: string[];         
  scrollTargetId?: string;  
 };

export default function Hero({
  images = [
    "https://media.foodandtravel.mx/wp-content/uploads/2024/02/Experiencias-gastronomicas-Costa-Rica-Isla-Venado-Restaurante-Flotante.jpg",
    "https://revistamagisteriocr.com/wp-content/uploads/2024/05/RM11-1.png",
    "https://www.periodicomensaje.com/images/bote_granja2.jpg",
  ],
  scrollTargetId = "menu",
}: HeroProps) {
  const handleScroll = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative w-full h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden">
      {/* Carrusel */}
      <Swiper
        className="w-full h-full"
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${src})` }}
            >
              {/* overlay para legibilidad */}
              <div className="w-full h-full bg-black/35" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Texto centrado */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-white max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-md">
            Bienvenidos al restaurante flotante de Manzanillo
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg opacity-95 drop-shadow">
            Sabores del mar y experiencias de ecoturismo en el Golfo de Nicoya.
          </p>
        </motion.div>
      </div>

      {/* Flecha hacia abajo (animación “bajar”) */}
      <button
        onClick={handleScroll}
        aria-label="Bajar al contenido"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 hover:bg-white p-2 shadow-lg"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-black" />
        </motion.div>
      </button>
    </section>
  );
}
