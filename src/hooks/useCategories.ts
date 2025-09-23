import { useEffect, useState, useCallback } from "react";
import type { Category } from "../types/menu/category";
import { MenuService } from "../services/menu/menu.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await MenuService.listCategories();
      setCategories(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return { categories, loading, reload };
}
