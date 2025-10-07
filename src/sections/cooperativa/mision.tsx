// src/sections/home/Mision.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCmsSection, useCmsSelectors } from "../../hooks/public/useCmsPublic";

export default function Mision() {
  const { data, loading } = useCmsSection("mudecoop");
  const { findByTitle, getImageUrl, blocks } = useCmsSelectors(data ?? null);

  const mision = findByTitle("misión");
  const vision = findByTitle("visión");

  // Fallback por si no existen títulos exactos en el CMS
  const slides = [mision, vision].filter(Boolean).length
    ? [mision, vision].filter(Boolean)
    : blocks.slice(0, 2);

  const loopMode = slides.length > 1;

  return (
    <section
      id="mision"
      className="bg-app p-4 md:p-8 mb-5 flex justify-center transition-colors"
    >
      <div className="w-full max-w-[1800px] relative min-h-[520px] md:min-h-[600px] grid place-items-center">
        {/* Botones de navegación */}
        <button
          className="custom-prev absolute top-1/2 -translate-y-1/2 text-muted hover:text-app z-20 left-2 md:left-8 transition-colors"
          aria-label="Anterior"
          type="button"
        >
          <FaChevronLeft size={28} />
        </button>

        <button
          className="custom-next absolute top-1/2 -translate-y-1/2 text-muted hover:text-app z-20 right-2 md:right-8 transition-colors"
          aria-label="Siguiente"
          type="button"
        >
          <FaChevronRight size={28} />
        </button>

        {/* Slider principal */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          loop={loopMode}
          centeredSlides
          centeredSlidesBounds
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 12000, disableOnInteraction: false }}
          className="w-full"
          style={{ ["--swiper-theme-color" as unknown as string]: "#50ABD7" }}
        >
          {(loading ? [null, null] : slides).map((block, index) => {
            const title = block?.title ?? (index === 0 ? "Misión" : "Visión");
            const texto = block?.body ?? "";
            const bg = getImageUrl(block);

            return (
              <SwiperSlide
                key={`${title}-${index}`}
                className="w-full grid place-items-center"
              >
                <div
                  className="relative w-full md:w-[85vw] max-w-[1200px] bg-card rounded-lg shadow
                             p-8 md:p-16 overflow-hidden flex flex-col justify-center items-center
                             min-h-[420px] md:min-h-[520px] mx-auto
                             border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  {/* Imagen de fondo (desde el CMS) */}
                  {bg && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                      style={{ backgroundImage: `url(${bg})` }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Overlay oscuro para modo dark */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      opacity: document.documentElement.classList.contains("dark")
                        ? 1
                        : 0,
                    }}
                  />

                  {/* Contenido */}
                  <div className="relative z-10 max-w-[900px] text-center mx-auto space-y-5">
                    <h2 className="text-2xl md:text-3xl font-bold text-app">
                      {title}
                    </h2>
                    <p className="text-app text-[15px] md:text-lg leading-relaxed opacity-90 whitespace-pre-line">
                      {loading ? "Cargando…" : texto}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
