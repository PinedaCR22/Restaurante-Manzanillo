// ✅ src/sections/cooperativa/cooperativeservices.tsx
import { useEffect, useState, memo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { coopPublicService } from "../../services/public/coopPublic.service";
import type { CoopActivity } from "../../types/activity/CoopActivity";

const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
};

const cardV: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function Cooperativeservices() {
  const [activities, setActivities] = useState<CoopActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const data = await coopPublicService.list();
        setActivities(data);
        setError(null);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error desconocido al cargar las actividades.";
        console.error("❌ Error cargando actividades:", message);
        setError("No se pudieron cargar las actividades.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section id="cooperativa" className="w-full py-16 text-center text-gray-500 animate-pulse">
        Cargando actividades...
      </section>
    );
  }

  if (error || !activities.length) {
    return (
      <section id="cooperativa" className="w-full py-16 text-center text-red-600">
        {error ?? "No hay actividades disponibles."}
      </section>
    );
  }

  return (
    <section id="cooperativa" className="w-full bg-app text-app py-10">
      <div className="px-3 md:px-6 text-center mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-wide text-app">
          ¡Descubre más sobre nuestras actividades!
        </h2>
        <div className="mt-3 h-[6px] w-full bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]" />
      </div>

      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center gap-5 md:gap-7 px-3 md:px-6"
      >
        {activities.map((a) => (
          <motion.button
            key={a.id}
            type="button"
            variants={cardV}
            onClick={() => navigate(`/cooperativa/${a.id}`)}
            className="group w-[calc(50%-0.625rem)] md:w-[calc(33.333%-1.167rem)] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="aspect-[5/3] w-full overflow-hidden bg-gray-100">
              <img
  src={
    a.image_path
      ? a.image_path.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : "https://picsum.photos/600/400?blur=5"
  }
  alt={a.title}
  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
/>

            </div>
            <div className="p-3 border-t border-gray-100">
              <span className="block text-center text-[13px] md:text-sm font-semibold uppercase tracking-wide text-white bg-[#50ABD7] rounded-md px-3 py-1">
                {a.title}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

export default memo(Cooperativeservices);
