// src/services/public/menuService.ts
export async function fetchMenuCategories() {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}/public/menu/categories`);
  if (!res.ok) {
    throw new Error(`Error al cargar categorías (${res.status})`);
  }
  return res.json();
}

export async function fetchMenuCategoryById(id: number | string) {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}/public/menu/categories/${id}`);
  if (!res.ok) {
    throw new Error(`Error al cargar categoría ${id} (${res.status})`);
  }
  return res.json();
}
