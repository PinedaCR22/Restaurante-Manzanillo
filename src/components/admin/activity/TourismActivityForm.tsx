"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { TourismActivity } from "../../../types/activity/TourismActivity";
import { tourismActivityService } from "../../../services/activity/tourismActivityService";
import { useSuccessDialog } from "../../../hooks/useSuccessDialog";

interface Props {
  activity?: TourismActivity | null;
  onSave: (id?: number) => void;
}

export function TourismActivityForm({ activity, onSave }: Props) {
  const [form, setForm] = useState({
    title: activity?.title ?? "",
    description: activity?.description ?? "",
    include_schedule_text: activity?.include_schedule_text ?? "",
    contact_phone: activity?.contact_phone ?? "",
    contact_email: activity?.contact_email ?? "",
    contact_note: activity?.contact_note ?? "",
    image_path: activity?.image_path ?? "",
    is_active: activity?.is_active ?? 1,
  });

  const [preview, setPreview] = useState<string | null>(
    activity?.image_path ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const { show, Dialog } = useSuccessDialog();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data: Omit<TourismActivity, "id" | "created_at" | "updated_at"> = {
      title: form.title,
      description: form.description,
      include_schedule_text: form.include_schedule_text,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      contact_note: form.contact_note,
      image_path: form.image_path || null,
      is_active: form.is_active,
      start_at: null,
      end_at: null,
      location: null,
      capacity: null,
    };

    const createdOrUpdated = activity
      ? await tourismActivityService.update(activity.id, data)
      : await tourismActivityService.create(data);

    const activityId = activity ? activity.id : createdOrUpdated.id;

    if (file && activityId) {
      await tourismActivityService.uploadImage(activityId, file);
    }

    show(activity ? "Actividad actualizada" : "Actividad creada", activity ? "La actividad se actualizó correctamente" : "La actividad se creó correctamente");
    // allow the success dialog to be visible briefly before navigating
    setTimeout(() => onSave(activityId), 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto text-gray-800"
    >
      {/* 🔹 Título */}
      <div>
        <label className="block text-sm font-semibold mb-2">Título</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D784A] transition"
          placeholder="Ej. Tour del Cacao"
          required
        />
      </div>

      {/* 🔹 Imagen principal */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Imagen principal
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-[#0D784A]/60 transition">
          <input
            id="tourism-file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="tourism-file-upload" className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="mx-auto h-48 w-auto object-cover rounded-xl shadow-md"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Haz clic o arrastra una imagen aquí
              </p>
            )}
          </label>
        </div>
      </div>

      {/* 🔹 Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-semibold">Estado</label>
        <select
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D784A]"
        >
          <option value={1}>Activa</option>
          <option value={0}>Inactiva</option>
        </select>
      </div>

      {/* 🔹 Botón Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#0D784A] text-white font-semibold rounded-xl hover:bg-[#09643F] shadow-md transition"
        >
          Guardar
        </button>
      </div>
      <Dialog />
    </form>
  );
}
