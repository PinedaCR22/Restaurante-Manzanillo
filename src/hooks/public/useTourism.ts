// src/hooks/useTourism.ts
import { useEffect, useState } from "react";
import { tourismPublicService } from "../../services/public/tourismPublic.service";
import type { TourismActivity } from "../../types/activity/TourismActivity";

export function useTourismActivities() {
  const [activities, setActivities] = useState<TourismActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await tourismPublicService.list();
      setActivities(res);
      setError(null);
    } catch (err) {
      console.error("❌ Error al cargar actividades:", err);
      setError("No se pudieron cargar las actividades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchActivities();
  }, []);

  return { activities, loading, error, refetch: fetchActivities };
}
