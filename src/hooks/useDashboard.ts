import { useEffect, useState } from "react";
import { MenuService } from "../services/menu/menu.service";
import { restaurantReservationService } from "../services/restaurant-reservations/restaurantReservation.service";
import { GalleryService } from "../services/gallery/gallery.service";
import type { RestaurantReservation } from "../types/restaurant-reservations/RestaurantReservation";
import type { Dish } from "../types/menu/dish";
import type { Gallery, GalleryImage } from "../types/gallery";

export interface DashboardStats {
  platillos: {
    total: number;
    activos: number;
    trend: string;
  };
  reservas: {
    pendientes: number;
    hoy: number;
    semana: number;
  };
  contacto: {
    nuevos: number;
    ultimas24h: number;
  };
  galeria: {
    total: number;
    recientes: number;
  };
}

export interface ActivityItem {
  id: number;
  type: "reserva" | "menu" | "galeria" | "contacto"; // 👈 se agrega contacto
  action: string;
  description: string;
  createdAt: string;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      // Ejecutar todas las llamadas en paralelo
      const [platillosData, reservasData, galeriesData] = await Promise.all([
        MenuService.listDishes().catch(() => [] as Dish[]),
        restaurantReservationService.getAll().catch(() => [] as RestaurantReservation[]),
        GalleryService.listGalleries(true).catch(() => [] as Gallery[]),
      ]);

      // Obtener todas las imágenes de todas las galerías
      let allImages: GalleryImage[] = [];
      if (galeriesData.length > 0) {
        const imagePromises = galeriesData.map((gallery) =>
          GalleryService.listImages(gallery.id).catch(() => [] as GalleryImage[])
        );
        const imagesArrays = await Promise.all(imagePromises);
        allImages = imagesArrays.flat();
      }

      // ==================== FECHAS BASE ====================
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      // ==================== 📊 PLATILLOS ====================
      const platillosActivos = platillosData.filter(
        (p) => p.isActive === true || p.isActive === 1
      ).length;

      const statsPlatillos = {
        total: platillosData.length,
        activos: platillosActivos,
        trend:
          platillosActivos > 0
            ? `+${platillosActivos} activos`
            : "Sin cambios",
      };

      // ==================== 📅 RESERVAS ====================
      const reservasPendientes = reservasData.filter(
        (r) => r.status === "pending"
      ).length;

      const reservasHoy = reservasData.filter((r) => {
        const resDate = new Date(r.date);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      }).length;

      const reservasSemana = reservasData.filter((r) => {
        const resDate = new Date(r.date);
        return resDate >= today && resDate < nextWeek;
      }).length;

      // ==================== 🖼️ GALERÍA ====================
      const imagenesVisibles = allImages.filter((img) => img.isVisible).length;
      const imagenesRecientes = Math.min(imagenesVisibles, 10);

      // ==================== 💬 CONTACTO (placeholder) ====================
      // ⚠️ TODO: reemplazar estos valores con datos reales
      // cuando se integre el servicio de mensajes de contacto.
      const mensajesNuevos = 0;
      const mensajes24h = 0;

      // ==================== 📈 CONSTRUIR ESTADÍSTICAS ====================
      const statsData: DashboardStats = {
        platillos: statsPlatillos,
        reservas: {
          pendientes: reservasPendientes,
          hoy: reservasHoy,
          semana: reservasSemana,
        },
        contacto: {
          nuevos: mensajesNuevos,
          ultimas24h: mensajes24h,
        },
        galeria: {
          total: imagenesVisibles,
          recientes: imagenesRecientes,
        },
      };

      // ==================== 🕓 ACTIVIDAD RECIENTE ====================
      const activityItems: ActivityItem[] = [];

      // 🔹 Reservas recientes
      reservasData
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3)
        .forEach((r) => {
          const statusText =
            r.status === "confirmed"
              ? "confirmada"
              : r.status === "pending"
              ? "pendiente"
              : "cancelada";

          activityItems.push({
            id: r.id,
            type: "reserva",
            action: "Nueva reserva",
            description: `Reserva ${statusText} para ${r.peopleCount} personas el ${new Date(
              r.date
            ).toLocaleDateString("es-CR")}`,
            createdAt: r.createdAt,
          });
        });

      // 🔹 Platillos (no hay createdAt, se simula)
      platillosData.slice(0, 2).forEach((d) => {
        activityItems.push({
          id: d.id,
          type: "menu",
          action: "Platillo actualizado",
          description: `Menú actualizado: ${d.name}`,
          createdAt: new Date().toISOString(),
        });
      });

      // 🔹 Imágenes de galería visibles
      allImages.slice(0, 2).forEach((img) => {
        activityItems.push({
          id: img.id,
          type: "galeria",
          action: "Nueva imagen agregada",
          description: `Imagen visible en la galería`,
          createdAt: new Date().toISOString(),
        });
      });

      // 🔹 (Placeholder) Mensaje de contacto nuevo
      activityItems.push({
        id: 9999,
        type: "contacto",
        action: "Nuevo mensaje",
        description: "Se recibió un nuevo mensaje de contacto",
        createdAt: new Date().toISOString(),
      });

      // 🔹 Ordenar y limitar actividad
      const sortedActivity = activityItems
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      // ==================== ✅ ACTUALIZAR ESTADO ====================
      setStats(statsData);
      setActivity(sortedActivity);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setError(err instanceof Error ? err.message : "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }

  return {
    stats,
    activity,
    loading,
    error,
    reload: loadDashboard,
  };
}
