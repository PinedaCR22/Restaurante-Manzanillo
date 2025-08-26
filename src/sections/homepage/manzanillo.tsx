// src/sections/home/Manzanillo.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaArrowDown } from "react-icons/fa";

// Asegúrate de tener en tu entry global:
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

export default function Manzanillo() {
  const images = [
    "https://www.malpaisbeach.com/wp-content/uploads/2012/06/manzanillo-640px.jpg",
    "https://production-uploads.fastly.propertybase.com/assets/uploads/post/featured_image/56728/1c262a553ba18f575c3b5d341aa83cf9.jpg",
    "https://i.ytimg.com/vi/_CuxsZnmhLg/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgWShUMA8=&rs=AOn4CLA7_9UbdvXwtkD7HCXQ6xDK7Q4KwA",
    "https://mariscossegura.wordpress.com/wp-content/uploads/2013/07/la-costa-_41.jpg",
    "https://i.pinimg.com/736x/a9/42/41/a94241793884ea258f6865acbeee05ae.jpg",
  ];

  // Definición de paneles (5) en porcentajes para que sea fluido y responsivo
  const panels: { clipPath: string; phase: number; speed: number; parallax: number }[] = [
    { clipPath: "polygon(0% 8%, 18% 2%, 18% 92%, 0% 100%)",      phase: 0.0, speed: 16, parallax: 12 }, // extremo izq
    { clipPath: "polygon(14% 4%, 34% 0%, 32% 100%, 12% 96%)",    phase: 0.25, speed: 18, parallax: 10 }, // izq
    { clipPath: "polygon(32% 2%, 68% 2%, 68% 98%, 32% 98%)",     phase: 0.5, speed: 20, parallax: 6 },  // centro
    { clipPath: "polygon(66% 0%, 86% 4%, 88% 98%, 66% 100%)",    phase: 0.75, speed: 18, parallax: 10 }, // der
    { clipPath: "polygon(82% 2%, 100% 8%, 100% 100%, 84% 96%)",  phase: 0.1, speed: 16, parallax: 12 }, // extremo der
  ];

  return (
    <section className="w-full py-10 px-4 md:px-6">
      <div className="relative w-full">
        <Swiper
          className="w-full h-[50vh] rounded-xl overflow-hidden shadow-lg"
          modules={[Autoplay, Pagination, Navigation]}
          loop
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
        >
          <SwiperSlide>
            <div className="relative w-full h-full bg-black">
              {/* Fondo sutil para los gaps */}
              <div className="absolute inset-0 bg-black/10" />

              {/* Paneles del collage con animación mejorada */}
              {panels.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    WebkitClipPath: p.clipPath as any,
                    clipPath: p.clipPath as any,
                    backgroundImage: `url(${images[i % images.length]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  // Animación: parallax (x), pan de background, y leve escala
                  animate={{
                    x: [ -p.parallax, p.parallax, -p.parallax ],
                    scale: [1.02, 1, 1.02],
                    backgroundPositionX: ["0%", "25%", "0%"],
                  }}
                  transition={{
                    duration: p.speed,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: p.phase,
                  }}
                >
                  {/* overlay sutil para contraste */}
                  <div className="absolute inset-0 bg-black/10" />
                </motion.div>
              ))}

              {/* Líneas finas que marcan las juntas (opcional) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[18%] top-0 bottom-0 w-[2px] bg-white/20 rotate-[353deg]" />
                <div className="absolute left-[34%] top-0 bottom-0 w-[2px] bg-white/20 rotate-[356deg]" />
                <div className="absolute left-[68%] top-0 bottom-0 w-[2px] bg-white/20 rotate-[-356deg]" />
                <div className="absolute left-[86%] top-0 bottom-0 w-[2px] bg-white/20 rotate-[-353deg]" />
              </div>

              {/* Overlay de contenido (título, flecha, botón) */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
                {/* Caja glassmorphism para separar del fondo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="backdrop-blur-md bg-white/15 border border-white/25 rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                >
                  <h2 className="text-white text-xl md:text-3xl font-extrabold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]">
                    ¡Descubre todo lo que Manzanillo tiene para ofrecerte!
                  </h2>
                </motion.div>

                {/* Flecha animada */}
                <motion.div
                  aria-hidden
                  className="mt-4 text-white text-2xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaArrowDown />
                </motion.div>

                {/* Botón dentro del collage */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-5"
                >
                  <Link
                    to="/activities"
                    className="rounded-full bg-[#50ABD7]/90 hover:bg-[#3f98c1] text-white px-6 py-2 font-semibold shadow-lg border border-white/30 backdrop-blur-md"
                  >
                    Conocer más
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
