// ✅ src/pages/cooperativa-dinamica.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coopPublicService } from "../services/public/coopPublic.service";
import { motion, AnimatePresence } from "framer-motion";
import type { CoopActivity } from "../types/activity/CoopActivity";

export default function CooperativaDinamicaPage() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<CoopActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const data = await coopPublicService.get(Number(id));
        setActivity(data);
        setError(null);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error desconocido al cargar la actividad.";
        console.error("❌ Error cargando actividad:", message);
        setError("No se pudo cargar la información de esta actividad.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <section className="py-20 text-center text-gray-500 animate-pulse">
        Cargando información...
      </section>
    );
  }

  if (error || !activity) {
    return (
      <section className="py-20 text-center text-red-600">
        {error ?? "No se encontró la actividad solicitada."}
      </section>
    );
  }

  return (
    <section className="w-full bg-app text-app">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-10">
        {/* ENCABEZADO */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">{activity.title}</h1>
          {activity.description && (
            <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
              {activity.description}
            </p>
          )}
        </header>

        {/* BLOQUES */}
        {activity.blocks?.map((b, i) => (
          <motion.article
            key={b.id}
            className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-card text-app"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
              {/* Imagen */}
              <div
                className={`relative ${
                  i % 2 === 1 ? "md:order-2" : "md:order-1"
                } aspect-square md:aspect-[16/9] md:min-h-[300px] lg:min-h-[340px]`}
              >
                <AnimatePresence mode="wait">
                 <motion.img
  key={b.image_path ?? i}
  src={
    b.image_path
      ? b.image_path.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : "https://picsum.photos/800/500?blur=5"
  }
  alt={b.title ?? ""}
  className="absolute inset-0 h-full w-full object-cover"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.6 }}
  loading="lazy"
/>

                </AnimatePresence>
              </div>

              {/* Texto */}
              <div
                className={`p-6 md:p-8 ${
                  i % 2 === 1 ? "md:order-1" : "md:order-2"
                } flex items-center`}
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {b.title}
                  </h2>
                  {b.body && (
                    <p className="text-base md:text-lg mb-2.5">{b.body}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        {/* FORMULARIO DE CONTACTO */}
        <motion.article
          className="w-full rounded-xl border border-gray-200 bg-card shadow-sm overflow-hidden text-app"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
            {/* Imagen lateral */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[460px] lg:min-h-[520px]">
              <img
  src={
    activity.image_path
      ? activity.image_path.replace(
          "http://localhost:3000",
          "https://mudecoopback-production.up.railway.app"
        )
      : "https://picsum.photos/600/400?blur=5"
  }
  alt="Contáctanos"
  className="absolute inset-0 h-full w-full object-cover"
/>

            </div>

            {/* Formulario */}
            <div className="p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-center">
                ¡Contáctanos para reservar o saber más!
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);

                  const payload = {
                    full_name: formData.get("nombre") as string,
                    email: (formData.get("email") as string) || undefined,
                    phone: (formData.get("telefono") as string) || undefined,
                    message: (formData.get("mensaje") as string) || undefined, // 👈 Corregido: usa message
                  };

                  try {
                    console.log("📤 Enviando contacto:", payload);
                    await coopPublicService.createActivityContact(Number(id), payload);
                    alert("✅ ¡Gracias por contactarnos! Te responderemos pronto.");
                    form.reset();
                  } catch (e) {
                    const msg =
                      e instanceof Error
                        ? e.message
                        : "Error desconocido al enviar el mensaje.";
                    console.error("❌ Error al enviar contacto:", msg);
                    alert("Ocurrió un error al enviar tu mensaje. Intenta nuevamente.");
                  }
                }}
                className="space-y-4"
              >
                <input
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />
                <input
                  name="email"
                  placeholder="Tu correo"
                  type="email"
                  className="w-full rounded-lg border px-4 py-2"
                />
                <input
                  name="telefono"
                  placeholder="Teléfono (opcional)"
                  className="w-full rounded-lg border px-4 py-2"
                />
                <textarea
                  name="mensaje"
                  rows={6}
                  placeholder="Cuéntanos más..."
                  required
                  className="w-full rounded-lg border px-4 py-2"
                />

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/cooperativa")}
                    className="px-6 py-2 bg-gray-200 text-black hover:bg-gray-300 rounded-lg"
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#50ABD7] text-white font-semibold hover:bg-[#3f98c1]"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
