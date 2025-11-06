// src/hooks/faq/useFaqAdmin.ts

import { useEffect, useState } from "react";
import type { FaqItem, FaqForm } from "../../types/faqs/faq";
import { faqService } from "../../services/faq/faqService";
import { useToast } from "../useToast";

export function useFaqAdmin() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setLoading(true);
      const data = await faqService.getAll();
      setItems(data);
    } catch (err) {
      console.error("Error cargando FAQs:", err);
      push({ type: "error", title: "Error al cargar FAQs" });
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(form: FaqForm) {
    try {
      const created = await faqService.create({
        question: form.question,
        answer: form.answer,
        tags: form.tags.length > 0 ? form.tags : null,
        isVisible: form.isVisible,
        displayOrder: form.displayOrder,
      });
      setItems((prev) => [...prev, created]);
      push({ type: "success", title: "FAQ creada", message: "La FAQ se creó correctamente" });
    } catch (err) {
      console.error("Error creando FAQ:", err);
      push({ type: "error", title: "Error al crear FAQ" });
      throw err;
    }
  }

  async function onEdit(id: number, form: FaqForm) {
    try {
      const updated = await faqService.update(id, {
        question: form.question,
        answer: form.answer,
        tags: form.tags.length > 0 ? form.tags : null,
        isVisible: form.isVisible,
        displayOrder: form.displayOrder,
      });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      push({ type: "success", title: "FAQ actualizada", message: "Los cambios se guardaron correctamente" });
    } catch (err) {
      console.error("Error actualizando FAQ:", err);
      push({ type: "error", title: "Error al actualizar FAQ" });
      throw err;
    }
  }

  async function onDelete(id: number) {
    try {
      await faqService.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      push({ type: "success", title: "FAQ eliminada", message: "La FAQ se eliminó correctamente" });
    } catch (err) {
      console.error("Error eliminando FAQ:", err);
      push({ type: "error", title: "Error al eliminar FAQ" });
      throw err;
    }
  }

  async function onToggleVisible(id: number, isVisible: boolean) {
    try {
      const updated = await faqService.update(id, { isVisible });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isVisible: updated.isVisible } : item))
      );
      push({
        type: "success",
        title: `FAQ ${isVisible ? "activada" : "desactivada"}`,
      });
    } catch (err) {
      console.error("Error cambiando visibilidad:", err);
      push({ type: "error", title: "Error al cambiar visibilidad" });
      throw err;
    }
  }

  async function onReorder(id: number, newOrder: number) {
    try {
      const updated = await faqService.update(id, { displayOrder: newOrder });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, displayOrder: updated.displayOrder } : item
        )
      );
    } catch (err) {
      console.error("Error reordenando FAQ:", err);
      push({ type: "error", title: "Error al cambiar orden" });
      throw err;
    }
  }

  const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.displayOrder)) + 1 : 1;

  return {
    items,
    loading,
    onCreate,
    onEdit,
    onDelete,
    onToggleVisible,
    onReorder,
    nextOrder,
    reload: loadFaqs,
  };
}