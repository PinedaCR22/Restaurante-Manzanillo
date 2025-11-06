"use client";
import { useState } from "react";
import { CoopActivityList } from "../../components/admin/activity/CoopActivityList";
import { TourismActivityList } from "../../components/admin/activity/TourismActivityList";
import { CoopActivityDetail } from "../../components/admin/activity/CoopActivityDetail";
import { TourismActivityDetail } from "../../components/admin/activity/TourismActivityDetail";

export default function ActivityPage() {
  const [tab, setTab] = useState<"coop" | "tourism">("coop");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleBack = (): void => setSelectedId(null);

  return (
    <section className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 🔹 Encabezado principal */}
      <h1 className="mb-6 text-2xl font-bold text-[#0D784A]">
        Gestión de Actividades
      </h1>

      {/* 🔹 Tabs estandarizados (tipo CMS) */}
      <div className="border-b border-[#C6E3D3] mb-8 flex flex-wrap items-center gap-6">
        {[
          { key: "coop", label: "Cooperativas" },
          { key: "tourism", label: "Turísticas" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={(): void => {
              setTab(key as "coop" | "tourism");
              setSelectedId(null);
            }}
            className={`relative pb-2 text-sm font-medium transition-all duration-200 
              ${
                tab === key
                  ? "text-[#0D784A] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#0D784A]"
                  : "text-[#0D784A]/60 hover:text-[#0D784A]"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 🔹 Contenedor principal */}
      <div className="rounded-2xl border border-[#C6E3D3] bg-white p-6 shadow-sm transition-all duration-300">
        {selectedId ? (
          tab === "coop" ? (
            <CoopActivityDetail id={selectedId} onBack={handleBack} />
          ) : (
            <TourismActivityDetail id={selectedId} onBack={handleBack} />
          )
        ) : tab === "coop" ? (
          <CoopActivityList onSelect={(id: number): void => setSelectedId(id)} />
        ) : (
          <TourismActivityList onSelect={(id: number): void => setSelectedId(id)} />
        )}
      </div>
    </section>
  );
}
