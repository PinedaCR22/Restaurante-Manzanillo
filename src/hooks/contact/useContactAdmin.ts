import { useCallback, useEffect, useMemo, useState } from "react";
import { ContactService } from "../../services/contact/contact.service";
import type { ContactForm, ContactItem } from "../../types/contact/contact";

export function useContactAdmin() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await ContactService.list();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = useCallback(
    async (form: ContactForm) => {
      await ContactService.create(form);
      await load();
    },
    [load]
  );

  const onEdit = useCallback(
    async (id: number, form: ContactForm) => {
      await ContactService.update(id, form);
      await load();
    },
    [load]
  );

  const onDelete = useCallback(
    async (id: number) => {
      await ContactService.remove(id);
      await load();
    },
    [load]
  );

  const onToggle = useCallback(
    async (id: number, val: boolean) => {
      await ContactService.updateVisibility(id, val);
      await load();
    },
    [load]
  );

  const onReorder = useCallback(
    async (id: number, displayOrder: number) => {
      await ContactService.updateOrder(id, displayOrder);
      await load();
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
    reload: load,
    onCreate,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
    nextOrder,
  };
}
