// src/services/menu/menu.service.ts
import type { Category } from "../../types/menu/category";
import type { Dish } from "../../types/menu/dish";
import type { CategoryForm, DishForm } from "../../types/menu/forms";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Busca token en varias llaves (dev-friendly)
function getToken(): string {
  const envToken = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_DEV_TOKEN ?? "";
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    envToken ||
    ""
  );
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const url = `${API_BASE}${path}`;

  // Normaliza headers del caller
  let caller: Record<string, string> = {};
  if (init.headers instanceof Headers) caller = Object.fromEntries(init.headers.entries());
  else if (Array.isArray(init.headers)) caller = Object.fromEntries(init.headers as Array<[string, string]>);
  else if (init.headers) caller = { ...(init.headers as Record<string, string>) };

  const headers: Record<string, string> = { ...caller };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    headers["Accept"] = headers["Accept"] ?? "application/json";
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 401) throw new Error(`No autorizado (401). ${text}`);
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json() as Promise<T>;
}

export const MenuService = {
  // Categorías
  listCategories(active?: boolean) {
    const qs = typeof active === "boolean" ? `?active=${active}` : "";
    return api<Category[]>(`/menu/categories${qs}`);
  },
  createCategory(payload: CategoryForm) {
    return api<Category>(`/menu/categories`, { method: "POST", body: JSON.stringify(payload) });
  },
  updateCategory(id: number, payload: Partial<CategoryForm>) {
    return api<Category>(`/menu/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  deleteCategory(id: number) {
    return api<{ ok: true }>(`/menu/categories/${id}`, { method: "DELETE" });
  },
  uploadCategoryImage(id: number, file: File) {
    const fd = new FormData();
    fd.append("image", file);
    return api<Category>(`/menu/categories/${id}/image`, { method: "POST", body: fd });
  },
  removeCategoryImage(id: number) {
    return api<Category>(`/menu/categories/${id}/image`, { method: "DELETE" });
  },

  // Platos
  listDishes(q?: { categoryId?: number; active?: boolean }) {
    const p = new URLSearchParams();
    if (q?.categoryId) p.set("categoryId", String(q.categoryId));
    if (typeof q?.active === "boolean") p.set("active", String(q.active));
    const qs = p.toString();
    return api<Dish[]>(`/menu/dishes${qs ? `?${qs}` : ""}`);
  },
  createDish(payload: DishForm) {
    return api<Dish>(`/menu/dishes`, { method: "POST", body: JSON.stringify(payload) });
  },
  updateDish(id: number, payload: Partial<DishForm>) {
    return api<Dish>(`/menu/dishes/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  },
  updateDishOrder(id: number, displayOrder: number) {
    return api<Dish>(`/menu/dishes/${id}/position`, { method: "PATCH", body: JSON.stringify({ displayOrder }) });
  },
  updateDishVisibility(id: number, isActive: boolean) {
    return api<Dish>(`/menu/dishes/${id}/visibility`, { method: "PATCH", body: JSON.stringify({ isActive }) });
  },
  deleteDish(id: number) {
    return api<{ ok: true }>(`/menu/dishes/${id}`, { method: "DELETE" });
  },
};
