import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../hooks/public/useMenu";

// ===================== TIPOS =====================
export type Category = {
  id: number | string;
  name: string;
  imagePath?: string | null;
};

// ===================== ANIMACIONES =====================
const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};

const cardV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// ===================== FALLBACK LOCAL =====================
const DEFAULT: Category[] = [
  { id: "ceviches", name: "Ceviches", imagePath: "https://i.ytimg.com/vi/YF-yzSOyQsE/maxresdefault.jpg" },
  { id: "mariscos", name: "Mariscos", imagePath: "https://media.istockphoto.com/id/1305699663/es/foto/plato-de-mariscos-langosta-a-la-parrilla-camarones-vieiras-langostinos-pulpo-calamar-en-plato.jpg?s=612x612&w=0&k=20&c=H_dWTXDSIuNKsdyN-WCZB8X--1Iy64V4m4E4Zq9wns4=" },
  { id: "pescados", name: "Pescados", imagePath: "https://www.recetasnestle.com.co/sites/default/files/inline-images/Recetas_2_-Mojarra-con-ensalada-de-aguacate%2C-arroz-con-coco%2C-pla%CC%81tano-y-limo%CC%81n_1200x500.jpeg" },
  { id: "casados", name: "Casados", imagePath: "https://morphocostarica.com/wp-content/uploads/2020/03/Casado.jpg" },
  { id: "batidos", name: "Batidos", imagePath: "https://hiraoka.com.pe/media/mageplaza/blog/post/j/u/juegos_y_batidos_saludables_nutritivos-hiraoka.jpg" },
  { id: "com-rapida", name: "Com. rápida", imagePath: "https://images.unsplash.com/photo-1550547660-d9450f859349?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0" },
  { id: "alcohol", name: "Alcohol", imagePath: "https://media.istockphoto.com/id/475273684/es/foto/frascos-y-gafas-de-una-variedad-de-bebidas-alcoh%C3%B3licas.jpg?s=612x612&w=0&k=20&c=SgFGQskDEHv_--Teekq_J4DQ7rOdZybPSX2j37H51Ck=" },
  { id: "cocteles", name: "Cocteles", imagePath: "https://animalgourmet.com/wp-content/uploads/2019/12/cocteles-faciles-1-e1577462291521.jpg" },
  { id: "vinos", name: "Vinos", imagePath: "https://vivancoculturadevino.es/blog/wp-content/uploads/2015/07/vino-rosado-blanco-tinto.jpg" },
];

// ===================== UTILS =====================
function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

// ===================== COMPONENTE PRINCIPAL =====================
function Menu({
  title = "¡DESCUBRE NUESTRO MENÚ!",
  titleClassName,
}: {
  title?: string;
  titleClassName?: string;
}) {
  const { data, loading, error } = useMenu();
  const navigate = useNavigate();

  // 🔹 Fusiona datos backend + fallback local
  const categories = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((c) => ({
        id: c.id,
        name: c.name,
        // ✅ Garantizamos que siempre sea string
        imagePath:
          c.imagePath && c.imagePath !== "null"
            ? `${import.meta.env.VITE_API_URL}${c.imagePath}`
            : "https://via.placeholder.com/400x250?text=Sin+imagen",
      }));
    }
    return DEFAULT;
  }, [data]);

  const handleClick = (id: number | string) => navigate(`/menu/${id}`);

  // ===================== RENDER =====================
  if (loading) {
    return (
      <section id="menu" className="anchor-offset w-full bg-app text-app py-10">
        <p className="text-center text-app font-medium">Cargando menú...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="anchor-offset w-full bg-app text-app py-10">
        <p className="text-center text-red-600 font-semibold">
          Error al cargar el menú. Mostrando contenido temporal.
        </p>
      </section>
    );
  }

  return (
    <section id="menu" className="anchor-offset w-full bg-app text-app">
      {/* Título */}
      <div className="px-3 md:px-6">
        <div className="mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-4 text-center">
          <h2
            className={clsx(
              "text-xl md:text-2xl font-extrabold tracking-wide",
              titleClassName
            )}
          >
            {title}
          </h2>
          <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
        </div>
      </div>

      {/* Grilla de categorías */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
          {categories.map((cat, i) => {
            const isOddLastOnMobile = categories.length % 2 === 1 && i === categories.length - 1;

            return (
              <motion.button
                key={cat.id}
                type="button"
                variants={cardV}
                onClick={() => handleClick(cat.id)}
                aria-label={`Abrir categoría ${cat.name}`}
                className={clsx(
                  "group rounded-xl overflow-hidden shadow-sm transition hover:shadow-md focus:outline-none",
                  "bg-card border",
                  "border-[color:color-mix(in srgb,var(--fg) 14%,transparent)]",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  "focus-visible:ring-[color:color-mix(in srgb,var(--fg) 30%, transparent)]",
                  "focus-visible:ring-offset-[color:var(--bg)]",
                  "w-full md:max-w-[320px] lg:max-w-[340px] xl:max-w-[360px] md:justify-self-center",
                  isOddLastOnMobile && "col-span-2 justify-self-center md:col-span-1"
                )}
              >
                <div className="aspect-[5/3] w-full overflow-hidden">
                  <img
                    src={cat.imagePath ?? "https://via.placeholder.com/400x250?text=Sin+imagen"}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-2 md:p-3">
                  <span
                    className="
                      block rounded-md px-3 py-1 text-center text-sm font-semibold text-white
                      transition-colors
                    "
                    style={{
                      background: "#50ABD7", // azul fijo del tema
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(Menu);
