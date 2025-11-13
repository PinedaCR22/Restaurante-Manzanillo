"use client";
import { useEffect, useState } from "react";
import type { CoopActivity } from "../../../types/activity/CoopActivity";
import { coopActivityService } from "../../../services/activity/coopActivityService";
import { CoopActivityForm } from "./CoopActivityForm";
import Button from "../../ui/Button";
import ModalBase from "../../ui/ModalBase";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useSuccessDialog } from "../../../hooks/useSuccessDialog";
import { API_URL } from "../../../lib/config";

interface Props {
  onSelect: (id: number) => void;
}

export function CoopActivityList({ onSelect }: Props) {
  const [activities, setActivities] = useState<CoopActivity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<CoopActivity | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm?: () => void }>(
    {
    open: false,
    message: "",
  });
  const { show, Dialog } = useSuccessDialog();

  const fetchData = async (): Promise<void> => {
    const data = await coopActivityService.list();
    setActivities(data);
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleSave = async (createdId?: number): Promise<void> => {
    setShowForm(false);
    setSelected(null);
    await fetchData();
    if (createdId) onSelect(createdId);
  };

  const askConfirm = (message: string, onConfirm: () => void) =>
    setConfirm({ open: true, message, onConfirm });

  const handleConfirm = () => {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ open: false, message: "" });
  };

  const handleDelete = async (id: number): Promise<void> => {
    askConfirm("¿Eliminar esta actividad?", async () => {
      await coopActivityService.remove(id);
      await fetchData();
      show("Actividad eliminada", "La actividad se eliminó correctamente");
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-[#0D784A] tracking-wide">
          Actividades Cooperativas
        </h2>
        <Button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          className="px-5 py-2 text-base"
        >
          + Nueva Actividad
        </Button>
      </div>

      {/* 🔹 Tarjetas */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((a) => (
          <div
            key={a.id}
            className="group relative rounded-2xl bg-white shadow-sm border border-[#DDEEE3] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Imagen */}
            <button
              type="button"
              onClick={() => onSelect(a.id)}
              className="w-full text-left"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                {a.image_path ? (
                <img
  src={
    a.image_path
      ? a.image_path.startsWith("http")
        ? a.image_path
        : `${API_URL.replace(/\/$/, "")}${a.image_path.startsWith("/") ? a.image_path : "/" + a.image_path}`
      : "/placeholder.jpg"
  }
  alt={a.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {a.title}
                  </h3>
                  <span
                    className={`ml-3 inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      a.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            </button>

            {/* Acciones */}
            <div className="flex justify-end gap-2 px-4 pb-4 border-t border-gray-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelected(a);
                  setShowForm(true);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => void handleDelete(a.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}

        {!activities.length && (
          <p className="text-center col-span-full text-gray-500 text-base">
            No hay actividades registradas.
          </p>
        )}
      </div>

      {/* 🔹 Modal crear/editar */}
      <ModalBase
        open={showForm}
        title={selected ? "Editar Actividad" : "Nueva Actividad"}
        onClose={() => setShowForm(false)}
      >
        <CoopActivityForm
          activity={selected}
          onSave={(id?: number): void => {
            void handleSave(id);
          }}
        />
      </ModalBase>

      {/* 🔹 ConfirmDialog */}
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onCancel={() => setConfirm({ open: false, message: "" })}
        onConfirm={handleConfirm}
      />
      <Dialog />
    </div>
  );
}
