// src/sections/home/Activities.tsx
import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type Activity = { id: string; name: string; image?: string };

type ActivitiesProps = {
  title?: string;
  titleClassName?: string;
  activities?: Activity[];
  onSelectActivity?: (id: string) => void;
};

const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};

const cardV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// Placeholder estático y confiable
const PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

// EXACTAMENTE 8 cards con los títulos del mock
const DEFAULT: Activity[] = [
  { id: "aso-coyolito",        name: "ASO. COYOLITO",        image: "https://i0.wp.com/asociacionprovida.sv/wp-content/uploads/2020/01/83056884_3421484794592937_4417633258485841920_n.jpg?fit=960%2C640&ssl=1&w=640" },
  { id: "malecon",              name: "MALECÓN",              image: "https://pbs.twimg.com/media/DY8DdoKVAAEy82m.jpg" },
  { id: "juegos-tradicionales", name: "JGS. TRADICIONALES",   image: "https://www.radiogranma.icrt.cu/wp-content/uploads/2025/07/Imagen-de-WhatsApp-2025-07-19-a-las-13.06.35_d9795d07-1024x768.jpg" },
  { id: "tour-senderos",        name: "TOUR SENDEROS",        image: "https://vozdeguanacaste.com/wp-content/uploads/2018/01/samaratrails3_acrespoweb_copy.jpg" },
  { id: "hospedajes",           name: "HOSPEDAJES",           image: "https://images.trvl-media.com/lodging/92000000/91370000/91370000/91369970/dac2b80c.jpg?impolicy=fcrop&w=357&h=201&p=1&q=medium" },
  { id: "tours-en-bici",        name: "TOURS EN BICI",        image: "https://valleyadventours.com/wp-content/uploads/2017/10/tour-en-bicicleta-cali.jpg" },
  { id: "manzanillo-centro",    name: "MANZANILLO CENTRO",    image: "https://mariscossegura.wordpress.com/wp-content/uploads/2013/07/la-costa-_41.jpg" },
  { id: "pesca-artesanal",      name: "PESC. ARTESANAL",      image: "https://si.cultura.cr/_next/image?url=https%3A%2F%2Fsicultura-live.s3.amazonaws.com%2Fpublic%2Fmedia%2Fpesca_2.jpeg&w=3840&q=75" },
];

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Activities({
  title = "ACTIVIDADES",
  titleClassName,
  activities,
  onSelectActivity,
}: ActivitiesProps) {
  const data = useMemo(() => activities ?? DEFAULT, [activities]);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    onSelectActivity?.(id);
    navigate(`/activities/${id}`);
  };

  return (
    <section id="activities" className="w-full">
      {/* Título + línea degradada */}
      <div className="px-3 md:px-6">
        <div className="mx-auto rounded-xl bg-gray-100/80 shadow-sm backdrop-blur px-4 py-4 text-center">
          <h2
            className={clsx(
              "text-xl md:text-2xl font-extrabold tracking-wide text-stone-800",
              titleClassName
            )}
          >
            {title}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>
      </div>

      {/* Grid de actividades (8 cards) */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {data.map((act) => (
            <motion.button
              key={act.id}
              type="button"
              variants={cardV}
              onClick={() => handleClick(act.id)}
              aria-label={`Abrir actividad ${act.name}`}
              className={clsx(
                "group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden",
                "transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
                "w-full md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] justify-self-center"
              )}
            >
              <div className="aspect-[5/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={act.image || PLACEHOLDER}
                  alt={act.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-2 md:p-3">
                <span className="block rounded-md px-3 py-1 text-center text-[12px] md:text-sm font-semibold text-white uppercase tracking-wide transition-colors bg-[#50ABD7] group-hover:bg-[#3f98c1]">
                  {act.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(Activities);
