// src/hooks/public/useMenu.ts
import { useEffect, useState } from "react";
import { fetchMenuCategories } from "../../services/public/menu.service";

export type Dish = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  price: string;
  displayOrder: number;
  isActive: boolean;
};

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  imagePath?: string | null;
  dishes: Dish[];
};

export function useMenu() {
  const [data, setData] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("📡 Solicitando menú desde:", import.meta.env.VITE_API_URL);
        const json = await fetchMenuCategories();
        console.log("✅ Datos recibidos del backend:", json);
        setData(json);
      } catch (err) {
        console.error("❌ Error cargando menú:", err);
        setError("No se pudo cargar el menú");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}
