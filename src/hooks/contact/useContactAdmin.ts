import { useCallback, useEffect, useMemo, useState } from "react";
import { ContactService } from "../../services/contact/contact.service";
import type { ContactForm, ContactItem } from "../../types/contact/contact";

export function useContactAdmin() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    console.log("🔄 [useContactAdmin] Iniciando carga...");
    try {
      setLoading(true);
      setError(null);
      const data = await ContactService.list();
      console.log("✅ [useContactAdmin] Contactos cargados:", data);
      setItems(data);
    } catch (err) {
      console.error("❌ [useContactAdmin] Error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = useCallback(
    async (form: ContactForm) => {
      console.log("➕ [useContactAdmin] Creando contacto:", form);
      try {
        await ContactService.create(form);
        await load();
      } catch (err) {
        console.error("❌ [useContactAdmin] Error al crear:", err);
        throw err;
      }
    },
    [load]
  );

  const onEdit = useCallback(
    async (id: number, form: ContactForm) => {
      console.log("✏️ [useContactAdmin] Editando contacto:", id, form);
      try {
        await ContactService.update(id, form);
        await load();
      } catch (err) {
        console.error("❌ [useContactAdmin] Error al editar:", err);
        throw err;
      }
    },
    [load]
  );

  const onDelete = useCallback(
    async (id: number) => {
      console.log("🗑️ [useContactAdmin] Eliminando contacto:", id);
      try {
        await ContactService.remove(id);
        await load();
      } catch (err) {
        console.error("❌ [useContactAdmin] Error al eliminar:", err);
        throw err;
      }
    },
    [load]
  );

  const onToggle = useCallback(
    async (id: number, val: boolean) => {
      console.log("🔄 [useContactAdmin] Toggle visibilidad:", id, val);
      try {
        await ContactService.updateVisibility(id, val);
        await load();
      } catch (err) {
        console.error("❌ [useContactAdmin] Error al toggle:", err);
        throw err;
      }
    },
    [load]
  );

  const onReorder = useCallback(
    async (id: number, displayOrder: number) => {
      console.log("🔢 [useContactAdmin] Reordenando:", id, displayOrder);
      try {
        await ContactService.updateOrder(id, displayOrder);
        await load();
      } catch (err) {
        console.error("❌ [useContactAdmin] Error al reordenar:", err);
        throw err;
      }
    },
    [load]
  );

  const nextOrder = useMemo(() => {
    const max = items.reduce((m, x) => Math.max(m, x.displayOrder), 0);
    return max + 1;
  }, [items]);

  return {
    items,
    loading,
    error, // 👈 Exportar el error
    reload: load,
    onCreate,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
    nextOrder,
  };
}