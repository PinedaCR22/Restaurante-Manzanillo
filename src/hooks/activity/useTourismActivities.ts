"use client";
import { useEffect, useState } from "react";
import type { TourismActivity } from "../../types/activity/TourismActivity";
import { tourismActivityService } from "../../services/activity/tourismActivityService";

export function useTourismActivities() {
  const [activities, setActivities] = useState<TourismActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await tourismActivityService.list();
      setActivities(data);
    } catch {
      setError("Error al cargar actividades turísticas");
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: number) => {
    await tourismActivityService.remove(id);
    await loadActivities();
  };

  useEffect(() => {
    void loadActivities();
  }, []);

  return { activities, loading, error, loadActivities, deleteActivity };
}
