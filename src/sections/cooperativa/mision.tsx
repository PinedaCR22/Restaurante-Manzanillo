// src/sections/home/Mision.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type Card = {
  titulo: string;
  contenido: string;
  multimedia?: string;
};

const CARDS: Card[] = [
  {
    titulo: 'Misión',
    contenido:
      'Nuestra misión es promover el turismo rural comunitario de manera amigable con el ambiente, contribuyendo integralmente al crecimiento y desarrollo económico y educativo de nuestras asociadas, sus familias y las comunidades aledañas. Buscamos fortalecer el vínculo entre la comunidad y la naturaleza, generando ingresos sostenibles y mejorando la calidad de vida local.',
    multimedia:
      'https://www.costaricacinefest.go.cr/sites/default/files/styles/resumen/public/media/img/principal/poster_wotm.jpg',
  },
  {
    titulo: 'Visión',
    contenido:
      'Aspiramos a ser la empresa líder en turismo y desarrollo sostenible en el sector de Manzanillo de Puntarenas, ofreciendo servicios de muy alta calidad y seguridad que satisfagan a nuestros clientes. Nos comprometemos a ser reconocidos por nuestras iniciativas ambientales y comunitarias.',
    multimedia:
      'https://lavozcooperativa.com/wp-content/uploads/2022/08/Mudecoop-2.jpeg',
  },
];

export default function Mision() {
  const loopMode = CARDS.length > 1;

  return (
    <section id="mision" className="bg-gray-50 p-4 md:p-8 mb-5 flex justify-center">
      <div className="w-full max-w-[1800px] relative min-h-[520px] md:min-h-[600px] grid place-items-center">
        {/* Flechas */}
        <button
          className="custom-prev absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 z-20 left-2 md:left-8"
          aria-label="Anterior"
          type="button"
        >
          <FaChevronLeft size={28} />
        </button>

        <button
          className="custom-next absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 z-20 right-2 md:right-8"
          aria-label="Siguiente"
          type="button"
        >
          <FaChevronRight size={28} />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          loop={loopMode}
          centeredSlides
          centeredSlidesBounds
          navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 12000, disableOnInteraction: false }}
          className="w-full"
        >
          {CARDS.map((d, i) => (
            <SwiperSlide key={`${d.titulo}-${i}`} className="w-full grid place-items-center">
              <div
                className="relative w-full md:w-[85vw] max-w-[1200px] bg-white rounded-lg shadow
                           p-8 md:p-16 overflow-hidden flex flex-col justify-center items-center
                           min-h-[420px] md:min-h-[520px] mx-auto"
              >
                {/* Marca de agua */}
                {d.multimedia && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                    style={{ backgroundImage: `url(${d.multimedia})` }}
                    aria-hidden="true"
                  />
                )}

                {/* Contenido */}
                <div className="relative z-10 max-w-[900px] text-center mx-auto space-y-5">
                  <h2 className="text-2xl md:text-3xl font-bold text-black">{d.titulo}</h2>
                  <p className="text-black/90 text-[15px] md:text-lg leading-relaxed">
                    {d.contenido}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
