import { useState } from "react";
import type { PageSection, SectionForm } from "../../types/cms";
import { CmsService } from "../../services/cms/cms.service";

export function useSectionForm(onSaved: () => void | Promise<void>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PageSection | null>(null);
  const [form, setForm] = useState<SectionForm>({
    sectionKey: "",
    panelTitle: "",
    isVisible: true,
  });
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ sectionKey: "", panelTitle: "", isVisible: true });
    setOpen(true);
  }

  function openEdit(s: PageSection) {
    setEditing(s);
    setForm({
      sectionKey: s.sectionKey,
      panelTitle: s.panelTitle ?? "",
      isVisible: !!s.isVisible,
    });
    setOpen(true);
  }

  async function submit() {
    if (!form.sectionKey.trim()) throw new Error("sectionKey requerido");
    setSaving(true);
    try {
      if (editing) await CmsService.updateSection(editing.id, form);
      else await CmsService.createSection(form);
      setOpen(false);
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  return { open, setOpen, editing, form, setForm, saving, openCreate, openEdit, submit };
}
