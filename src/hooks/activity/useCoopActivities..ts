"use client";
import { useEffect, useState } from "react";
import type { CoopActivity } from "../../types/activity/CoopActivity";
import { coopActivityService } from "../../services/activity/coopActivityService";

export function useCoopActivities() {
  const [activities, setActivities] = useState<CoopActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await coopActivityService.list();
      setActivities(data);
    } catch {
      setError("Error al cargar actividades cooperativas");
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: number) => {
    await coopActivityService.remove(id);
    await loadActivities();
  };

  useEffect(() => {
    void loadActivities();
  }, []);

  return { activities, loading, error, loadActivities, deleteActivity };
}
