// src/hooks/public/useCoopActivities.ts
import { useState, useEffect } from "react";
import { coopPublicService } from "../../services/public/coopPublic.service";
import type { CoopActivity } from "../../types/activity/CoopActivity";

export function useCoopActivities() {
  const [activities, setActivities] = useState<CoopActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("🔄 [useCoopActivities] Cargando actividades...");
        const data = await coopPublicService.list();
        
        // Filtrar solo activas
        const active = data.filter((act) => act.is_active === 1);
        setActivities(active);
        
        console.log(`✅ [useCoopActivities] ${active.length} actividades cargadas`);
      } catch (err) {
        console.error("❌ [useCoopActivities] Error:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { activities, loading, error };
}

export function useCoopActivity(idOrSlug: string | number) {
  const [activity, setActivity] = useState<CoopActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log(`🔄 [useCoopActivity] Cargando actividad: ${idOrSlug}`);
        
        let data: CoopActivity | null = null;
        
        if (typeof idOrSlug === "number") {
          data = await coopPublicService.get(idOrSlug);
        } else if (typeof idOrSlug === "string") {
          // Intentar como slug primero
          data = await coopPublicService.getBySlug(idOrSlug);
          
          // Si no se encuentra, intentar como ID numérico
          if (!data && !isNaN(Number(idOrSlug))) {
            data = await coopPublicService.get(Number(idOrSlug));
          }
        }
        
        setActivity(data);
        console.log("✅ [useCoopActivity] Actividad cargada:", data?.title);
      } catch (err) {
        console.error("❌ [useCoopActivity] Error:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, [idOrSlug]);

  return { activity, loading, error };
}