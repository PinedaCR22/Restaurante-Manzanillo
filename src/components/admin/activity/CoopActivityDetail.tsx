"use client";
import { useEffect, useState } from "react";
import type { CoopActivity } from "../../../types/activity/CoopActivity";
import { coopActivityService } from "../../../services/activity/coopActivityService";
import { CoopActivityBlocksForm } from "./CoopActivityBlocksForm";
import { CoopActivityContacts } from "./CoopActivityContacts";
import Button from "../../ui/Button";
import { API_URL } from "../../../lib/config";

type TabKey = "blocks" | "contacts";

interface Props {
  id: number;
  onBack: () => void;
}

export function CoopActivityDetail({ id, onBack }: Props) {
  const [activity, setActivity] = useState<CoopActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("blocks");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await coopActivityService.get(id);
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
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="text-[#0D784A] w-full sm:w-auto"
          >
            ← Volver
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0D784A] tracking-wide text-center sm:text-left w-full sm:w-auto">
            {activity.title}
          </h2>
        </div>
      </div>

      {/* Portada full-bleed */}
      {activity.image_path && (
        <div className="relative w-full mb-8 overflow-hidden">
        import { API_URL } from "../../../lib/config";

<img
  src={
    activity.image_path
      ? activity.image_path.startsWith("http")
        ? activity.image_path
        : `${API_URL.replace(/\/$/, "")}${activity.image_path.startsWith("/") ? activity.image_path : "/" + activity.image_path}`
      : "/placeholder.jpg"
  }
  alt={activity.title}
  className="w-full h-80 sm:h-[420px] object-cover object-center"
/>

        </div>
      )}

      {/* Tabs tipo “pill” */}
      <div className="w-full max-w-6xl mx-auto shadow-sm rounded-2xl bg-white p-6 sm:p-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-0.5 flex text-sm sm:text-base">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full font-semibold transition ${
                activeTab === "blocks"
                  ? "bg-[#0D784A] text-white"
                  : "text-gray-700 hover:text-[#0D784A]"
              }`}
            >
              Bloques de actividad
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full font-semibold transition ${
                activeTab === "contacts"
                  ? "bg-[#0D784A] text-white"
                  : "text-gray-700 hover:text-[#0D784A]"
              }`}
            >
              Mensajes de contacto
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="text-gray-900 text-base leading-relaxed">
          {activeTab === "blocks" ? (
            <CoopActivityBlocksForm activity={activity} />
          ) : (
            <CoopActivityContacts activityId={activity.id} />
          )}
        </div>
      </div>
    </div>
  );
}
