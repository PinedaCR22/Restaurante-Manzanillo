import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dish } from "../../types/menu/dish";
import { MenuService } from "../../services/menu/menu.service";

export function useDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await MenuService.listDishes();
      setDishes(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const counts = useMemo(() => {
    const map: Record<number | "all", number> = { all: 0 };
    for (const d of dishes) {
      map.all += 1;
      map[d.categoryId] = (map[d.categoryId] ?? 0) + 1;
    }
    return map;
  }, [dishes]);

  return { dishes, setDishes, loading, reload, counts };
}
