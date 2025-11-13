// src/hooks/public/useTourismDetail.ts
import { useEffect, useState } from "react";
import { tourismPublicService } from "../../services/public/tourismPublic.service";
import type { TourismActivity } from "../../types/activity/TourismActivity";

export function useTourismDetail(id?: number) {
  const [activity, setActivity] = useState<TourismActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // ✅ Validar ID antes de hacer cualquier cosa
    if (id === undefined || id === null || Number.isNaN(id) || id <= 0) {
      console.log("🔍 [useTourismDetail] ID inválido o no proporcionado:", id);
      if (isMounted) {
        setActivity(null);
        setError("ID de actividad inválido.");
        setLoading(false);
      }
      return;
    }

    console.log("🔍 [useTourismDetail] ID válido recibido:", id, "Tipo:", typeof id);

    const fetchData = async (): Promise<void> => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        console.log(`🔄 [useTourismDetail] Obteniendo actividad con ID: ${id}`);
        const response = await tourismPublicService.get(id);

        console.log("✅ [useTourismDetail] Actividad obtenida:", response);

        if (!response || typeof response !== "object") {
          throw new Error("Respuesta inválida del servidor");
        }

        if (isMounted) setActivity(response);
      } catch (caughtError: unknown) {
        console.error("❌ [useTourismDetail] Error:", caughtError);

        let message = "No se pudo cargar la actividad. Intente nuevamente.";
        if (caughtError instanceof Error) {
          if (caughtError.message.includes("404") || caughtError.message.includes("no encontrada")) {
            message = "Actividad no encontrada.";
          } else {
            message = caughtError.message;
          }
        }

        if (isMounted) {
          setError(message);
          setActivity(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { activity, loading, error };
}