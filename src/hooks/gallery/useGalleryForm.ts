import { useState } from "react";
import type { Gallery, GalleryForm } from "../../types/gallery";
import { GalleryService } from "../../services/gallery/gallery.service";

export function useGalleryForm(onSaved: () => void | Promise<void>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [form, setForm] = useState<GalleryForm>({
    title: "",
    description: "",
    layout: "grid",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", layout: "grid", isActive: true });
    setOpen(true);
  }

  function openEdit(g: Gallery) {
    setEditing(g);
    setForm({
      title: g.title,
      description: g.description ?? "",
      layout: g.layout,
      isActive: g.isActive,
    });
    setOpen(true);
  }

  async function submit() {
    if (!form.title.trim()) throw new Error("Título requerido");
    setSaving(true);
    try {
      if (editing) await GalleryService.updateGallery(editing.id, form);
      else await GalleryService.createGallery(form);
      setOpen(false);
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  return { open, setOpen, editing, form, setForm, saving, openCreate, openEdit, submit };
}
