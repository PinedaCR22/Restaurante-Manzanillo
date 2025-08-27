// Hero.tsx
import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Asegúrate de importar estilos globales de Swiper en tu app (p. ej. en main.tsx):
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

type HeroProps = {
  images?: string[];
  scrollTargetId?: string;
};

/** AnimatedText: anima PALABRA por PALABRA con stagger (evita cortes dentro de palabras) */
function AnimatedText({
  text,
  className,
  delay = 0.1,
  duration = 0.5,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const word: Variants = {
    hidden: { y: 14, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration, ease: [0.16, 1, 0.3, 1], type: "tween" },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={word} className="inline-block mr-2">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero({
  images = [
    "https://media.foodandtravel.mx/wp-content/uploads/2024/02/Experiencias-gastronomicas-Costa-Rica-Isla-Venado-Restaurante-Flotante.jpg",
    "https://revistamagisteriocr.com/wp-content/uploads/2024/05/RM11-1.png",
    "https://www.periodicomensaje.com/images/bote_granja2.jpg",
  ],
  scrollTargetId = "menu",
}: HeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleScroll = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative w-full h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden"
      aria-label="Sección principal con imágenes destacadas"
    >
      {/* Carrusel */}
      <Swiper
        className="w-full h-full"
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        onSwiper={(sw) => (swiperRef.current = sw)}
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} aria-roledescription="slide">
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${src})` }}
              role="img"
              aria-label="Imagen del restaurante flotante y su entorno"
            >
              {/* Gradiente + overlay para legibilidad */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/60" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Texto centrado con fondo blur igual que Manzanillo */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-md bg-black/25 border border-white/20 rounded-2xl px-6 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-center text-white max-w-3xl"
        >
          {/* Título animado palabra por palabra */}
          <AnimatedText
            text="Bienvenidos al restaurante flotante de Manzanillo"
            className="block text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
            delay={0.15}
            duration={0.45}
          />

          {/* Subtítulo animado palabra por palabra */}
          <AnimatedText
            text="Sabores del mar y experiencias de ecoturismo en el Golfo de Nicoya."
            className="block mt-3 md:mt-4 text-base md:text-lg opacity-95 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            delay={0.35}
            duration={0.4}
          />

          {/* Flecha hacia abajo dentro del bloque */}
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
        </motion.div>
      </div>

      {/* Flechas laterales sin círculos */}
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 transition-colors"
      >
        <ChevronLeft className="h-10 w-10 md:h-12 md:w-12 drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]" />
      </button>

      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 text-white hover:text-yellow-400 transition-colors"
      >
        <ChevronRight className="h-10 w-10 md:h-12 md:w-12 drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]" />
      </button>
    </section>
  );
}
