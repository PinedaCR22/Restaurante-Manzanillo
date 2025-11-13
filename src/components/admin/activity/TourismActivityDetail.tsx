"use client";
import { useEffect, useState } from "react";
import type { TourismActivity } from "../../../types/activity/TourismActivity";
import { tourismActivityService } from "../../../services/activity/tourismActivityService";
import { TourismActivityBlocksForm } from "./TourismActivityBlocksForm";
import Button from "../../ui/Button";
import { API_URL } from "../../../lib/config";

interface Props {
  id: number;
  onBack: () => void;
}

export function TourismActivityDetail({ id, onBack }: Props) {
  const [activity, setActivity] = useState<TourismActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await tourismActivityService.get(id);
      setActivity(data);
      setLoading(false);
    };
    void fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-24 text-[#0D784A]/70 text-lg font-medium">
        Cargando información de la actividad...
      </div>
    );

  if (!activity)
    return (
      <div className="text-center text-gray-500 py-24 text-lg">
        No se encontró la actividad.
      </div>
    );

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="text-[#0D784A]"
          >
            ← Volver
          </Button>
          <h2 className="text-3xl font-bold text-[#0D784A] tracking-wide">
            {activity.title}
          </h2>
        </div>
      </div>

      {/* Portada principal */}
      {activity.image_path && (
        <div className="relative w-full mb-8 overflow-hidden rounded-2xl shadow-sm border border-[#C6E3D3]">
         <img
  src={
    activity.image_path?.startsWith("http")
      ? activity.image_path
      : `${API_URL}${activity.image_path}`
  }
  alt={activity.title}
  className="w-full h-72 sm:h-[420px] object-cover object-center hover:scale-[1.02] transition-transform duration-500"
/>
        </div>
      )}

      {/* Descripción general */}
      {activity.description && (
        <div className="max-w-6xl mx-auto bg-white border border-[#C6E3D3] rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-[#0D784A] mb-3">
            Descripción general
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {activity.description}
          </p>
        </div>
      )}

      {/* Bloques de actividad */}
      <div className="w-full max-w-6xl mx-auto shadow-sm rounded-2xl bg-white p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-[#0D784A] mb-4">
          Bloques de actividad
        </h3>
        <TourismActivityBlocksForm activity={activity} />
      </div>
    </div>
  );
}
