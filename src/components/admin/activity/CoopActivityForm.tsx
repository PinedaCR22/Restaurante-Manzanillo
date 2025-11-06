"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { CoopActivity } from "../../../types/activity/CoopActivity";
import { coopActivityService } from "../../../services/activity/coopActivityService";
import { useSuccessDialog } from "../../../hooks/useSuccessDialog";

interface Props {
  activity?: CoopActivity | null;
  onSave: (id?: number) => void; // 🟢 cambio aquí
}

export function CoopActivityForm({ activity, onSave }: Props) {
  const [form, setForm] = useState({
    title: activity?.title ?? "",
    description: activity?.description ?? "",
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
    const data: Omit<CoopActivity, "id" | "created_at" | "updated_at"> = {
      title: form.title,
      description: form.description,
      include_text: null,
      instructions_text: null,
      image_path: form.image_path || null,
      is_active: form.is_active,
      start_at: null,
      end_at: null,
      location: null,
      capacity: null,
    };

    const createdOrUpdated = activity
      ? await coopActivityService.update(activity.id, data)
      : await coopActivityService.create(data);

    const activityId = activity ? activity.id : createdOrUpdated.id;

    if (file && activityId) {
      await coopActivityService.uploadImage(activityId, file);
    }

    show(activity ? "Actividad actualizada" : "Actividad creada", activity ? "La actividad se actualizó correctamente" : "La actividad se creó correctamente");
    // Esperar un momento antes de redirigir para que se vea el diálogo
    setTimeout(() => onSave(activityId), 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto text-gray-800"
    >
      <div>
        <label className="block text-sm font-semibold mb-2">Título</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          placeholder="Ej. Taller de Cerámica"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Imagen principal
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:border-emerald-400 transition">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-semibold">Estado</label>
        <select
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value={1}>Activa</option>
          <option value={0}>Inactiva</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition"
        >
          Guardar
        </button>
      </div>

      <Dialog />
    </form>
  );
}
