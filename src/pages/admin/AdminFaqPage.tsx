// src/pages/admin/AdminFaqPage.tsx

import { useMemo, useState } from "react";
import { useFaqAdmin } from "../../hooks/faq/useFaqAdmin";
import FaqFormModal from "../../components/admin/faq/FaqFormModal";
import FaqRow from "../../components/admin/faq/FaqRow";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { FaqItem, FaqForm } from "../../types/faqs/faq";
import { HelpCircle } from "lucide-react";

export default function AdminFaqPage() {
  const {
    items,
    loading,
    onCreate,
    onEdit: updateFaq,
    onDelete: deleteFaq,
    onToggleVisible,
    onReorder,
    nextOrder,
  } = useFaqAdmin();

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  // 🔍 Filtro con búsqueda en pregunta, respuesta y tags
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((faq) => {
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const tags = Array.isArray(faq.tags) ? faq.tags : [];
      const inTags = tags.some((tag) => tag.toLowerCase().includes(q));

      return inQuestion || inAnswer || inTags;
    });
  }, [items, query]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.displayOrder - b.displayOrder),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ⚙️ Acciones
  function handleCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleEdit(item: FaqItem) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSave(payload: FaqForm) {
    setSaving(true);
    try {
      if (editing) {
        await updateFaq(editing.id, payload);
      } else {
        const finalPayload = {
          ...payload,
          displayOrder: payload.displayOrder || nextOrder,
        };
        await onCreate(finalPayload);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("Error al guardar FAQ:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteFaq(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error al eliminar FAQ:", error);
    }
  }

  async function handleChangeOrder(id: number, order: number) {
    try {
      await onReorder(id, order);
    } catch (error) {
      console.error("Error al cambiar orden:", error);
    }
  }

  async function handleToggleVisible(id: number, isVisible: boolean) {
    try {
      await onToggleVisible(id, isVisible);
    } catch (error) {
      console.error("Error al cambiar visibilidad:", error);
    }
  }

  // ===============================
  // 🧩 INTERFAZ VISUAL
  // ===============================
  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* Título + acción */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D784A] flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Preguntas Frecuentes (FAQ)
        </h1>

        <Button onClick={handleCreate}>+ Nueva FAQ</Button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#E6F4EE] border border-[#C6E3D3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Total de FAQs</h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">{items.length}</p>
        </div>

        <div className="bg-[#E9F8EF] border border-[#B7E4C3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Visibles</h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
            {items.filter((f) => f.isVisible).length}
          </p>
        </div>

        <div className="bg-[#FDECEC] border border-[#F5C2C2] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Ocultas</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-1">
            {items.filter((f) => !f.isVisible).length}
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por pregunta, respuesta o tags..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D784A] focus:ring-1 focus:ring-[#0D784A] outline-none transition"
        />
      </div>

      {/* Listado */}
      <div className="space-y-4 min-h-[200px]">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando…</p>
        ) : paged.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {query ? "No se encontraron FAQs." : "No hay FAQs registradas."}
          </p>
        ) : (
          paged.map((faq) => (
            <FaqRow
              key={faq.id}
              item={faq}
              onEdit={handleEdit}
              onDelete={(id) => setConfirmDelete(id)}
              onChangeOrder={handleChangeOrder}
              onToggleVisible={handleToggleVisible}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      )}

      {/* Modal Crear/Editar */}
      <FaqFormModal
        open={modalOpen}
        initial={editing || undefined}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSave}
      />

      {/* Confirmación eliminar */}
      <ConfirmDialog
        open={!!confirmDelete}
        message="¿Seguro que deseas eliminar esta FAQ?"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete !== null) {
            handleDelete(confirmDelete);
          }
        }}
      />
    </section>
  );
}