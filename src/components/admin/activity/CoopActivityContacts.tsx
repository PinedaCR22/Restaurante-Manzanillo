"use client";
import { useEffect, useState } from "react";
import type { ActivityContact } from "../../../types/activity/ActivityContact";
import { activityContactService } from "../../../services/activity/activityContactService";
import Button from "../../ui/Button";
import ModalBase from "../../ui/ModalBase";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useSuccessDialog } from "../../../hooks/useSuccessDialog";

interface Props {
  activityId: number;
}

export function CoopActivityContacts({ activityId }: Props) {
  const [contacts, setContacts] = useState<ActivityContact[]>([]);
  const [selected, setSelected] = useState<ActivityContact | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm?: () => void }>({
    open: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const { show, Dialog } = useSuccessDialog();

  const loadContacts = async (): Promise<void> => {
    try {
      const data = await activityContactService.list(activityId);
      setContacts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts();
  }, [activityId]);

  const askConfirm = (message: string, onConfirm: () => void) =>
    setConfirm({ open: true, message, onConfirm });

  const handleConfirm = () => {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ open: false, message: "" });
  };

  const handleDelete = async (id: number): Promise<void> => {
    askConfirm("¿Eliminar este mensaje?", async () => {
      await activityContactService.remove(id);
      await loadContacts();
      show("Mensaje eliminado", "El mensaje de contacto se eliminó correctamente");
    });
  };

  if (loading)
    return <p className="text-center text-gray-500 py-10">Cargando contactos...</p>;

  return (
    <div className="space-y-6">
      {contacts.length === 0 ? (
        <div className="rounded-xl p-6 text-gray-600 text-center bg-gray-50">
          No hay mensajes de contacto para esta actividad.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer w-full"
              onClick={() => setSelected(c)}
            >
              <div className="flex justify-between items-start flex-wrap">
                <div className="flex-1">
                  <p className="font-semibold text-[#0D784A]">{c.full_name}</p>
                  <p className="text-sm text-gray-600">{c.email}</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(c.id);
                  }}
                  className="mt-2 sm:mt-0"
                >
                  Eliminar
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{c.message}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString("es-CR")}
              </p>
            </div>
          ))}
        </div>
      )}

      <ModalBase
        open={!!selected}
        title="Detalle del mensaje"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold text-[#0D784A]">Nombre:</span> {selected.full_name}</p>
            <p><span className="font-semibold text-[#0D784A]">Correo:</span> {selected.email}</p>
            {selected.phone && <p><span className="font-semibold text-[#0D784A]">Teléfono:</span> {selected.phone}</p>}
            <hr />
            <p className="whitespace-pre-line">{selected.message}</p>
            <p className="text-xs text-gray-400">
              Recibido el {new Date(selected.created_at).toLocaleString("es-CR")}
            </p>
          </div>
        )}
      </ModalBase>

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
