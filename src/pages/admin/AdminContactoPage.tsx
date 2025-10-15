import { useState } from "react";
import { Plus } from "lucide-react";
import { useContactAdmin } from "../../hooks/contact/useContactAdmin";
import ContactRow from "../../components/admin/contact/ContactRow";
import ContactFormModal from "../../components/admin/contact/ContactFormModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SuccessDialog from "../../components/ui/SuccessDialog";
import type { ContactItem } from "../../types/contact/contact";

export default function AdminContactPage() {
  const {
    items,
    loading,
    nextOrder,
    onCreate,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
  } = useContactAdmin();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ContactItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedId) await onDelete(selectedId);
    setConfirmOpen(false);
    setSelectedId(null);
    setSuccessOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-extrabold text-emerald-900">
        Información de contacto
      </h1>
      <p className="mb-6 text-emerald-800/80 max-w-xl">
        Administra los datos visibles del sitio
      </p>

      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4" /> Nuevo dato
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-emerald-200 bg-white p-6 text-center text-emerald-700/70">
          Cargando…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          Aún no hay información de contacto.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((it) => (
            <ContactRow
              key={it.id}
              item={it}
              onEdit={(item) => {
                setEditing(item);
                setOpenForm(true);
              }}
              onDelete={(id) => handleDelete(id)}
              onChangeOrder={(id, order) => void onReorder(id, order)}
              onToggleActive={(id, val) => void onToggle(id, val)}
            />
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      <ContactFormModal
        open={openForm}
        initial={
          editing ?? {
            value: "",
            displayOrder: nextOrder,
            isActive: true,
          }
        }
        onClose={() => setOpenForm(false)}
        onSubmit={async (payload) => {
          if (editing) await onEdit(editing.id, payload);
          else await onCreate(payload);
          setOpenForm(false);
          setSuccessOpen(true);
        }}
      />

      {/* Confirmación eliminación */}
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar contacto"
        message="¿Seguro que deseas eliminar este dato? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Éxito */}
      <SuccessDialog
        open={successOpen}
        title="Operación exitosa"
        message="La acción se realizó correctamente."
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
