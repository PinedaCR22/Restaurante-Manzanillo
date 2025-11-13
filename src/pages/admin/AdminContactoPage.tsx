import { useState, useMemo } from "react";
import ContactFormModal from "../../components/admin/contact/ContactFormModal";
import ContactRow from "../../components/admin/contact/ContactRow";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/admin/menu/SearchBar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { ContactItem, ContactForm } from "../../types/contact/contact";
import { useContactAdmin } from "../../hooks/contact/useContactAdmin"; // 👈 IMPORTAR

export default function ContactPage() {
  // 🔥 USAR EL HOOK REAL
  const {
    items: contacts,
    loading,
    error,
    onCreate,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
  } = useContactAdmin();

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContactItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // 🔍 Filtros con soporte en español e inglés
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const traducciones: Record<string, string[]> = {
      phone: ["teléfono", "telefono", "celular", "móvil", "movil", "whatsapp"],
      email: ["correo", "email", "mail"],
      facebook: ["facebook", "red social"],
      instagram: ["instagram", "ig"],
      tiktok: ["tiktok"],
      address: ["ubicación", "direccion", "dirección", "mapa", "address"],
      web: ["sitio", "página", "pagina", "web", "website"],
    };

    const matchTraduccion = (kind: string) => {
      const alias = traducciones[kind.toLowerCase()] || [];
      return alias.some((a) => a.includes(q)) || kind.toLowerCase().includes(q);
    };

    const base = q
      ? contacts.filter(
          (c) =>
            matchTraduccion(c.kind) ||
            c.value.toLowerCase().includes(q)
        )
      : contacts;

    return base.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [contacts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ⚙️ Acciones
  function handleCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleEditClick(item: ContactItem) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSave(payload: ContactForm) {
    try {
      setSaving(true);
      if (editing) {
        await onEdit(editing.id, payload);
      } else {
        await onCreate(payload);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Error guardando contacto:", err);
      alert("Error al guardar el contacto");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (confirmDelete === null) return;
    try {
      await onDelete(confirmDelete);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error eliminando contacto:", err);
      alert("Error al eliminar el contacto");
    }
  }

  async function handleChangeOrder(id: number, order: number) {
    try {
      await onReorder(id, order);
    } catch (err) {
      console.error("Error reordenando:", err);
    }
  }

  async function handleToggleActive(id: number, active: boolean) {
    try {
      await onToggle(id, active);
    } catch (err) {
      console.error("Error cambiando estado:", err);
    }
  }

  // 🔴 Mostrar error si hay
  if (error) {
    return (
      <section className="max-w-6xl mx-auto p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-800">
          <h3 className="font-semibold mb-2 text-lg">❌ Error al cargar contactos</h3>
          <p className="text-sm mb-4">{error}</p>
          <details className="text-xs">
            <summary className="cursor-pointer hover:underline">Ver detalles técnicos</summary>
            <pre className="mt-2 p-3 bg-red-100 rounded overflow-auto whitespace-pre-wrap">
              {error}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Recargar página
          </button>
        </div>
      </section>
    );
  }

  // ===============================
  // 🧩 INTERFAZ VISUAL
  // ===============================
  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* Título + acción */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0D784A]">
          Gestión de Contacto
        </h1>

        <Button onClick={handleCreate}>+ Nuevo Contacto</Button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#E6F4EE] border border-[#C6E3D3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">
            Contactos totales
          </h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
            {contacts.length}
          </p>
        </div>

        <div className="bg-[#E9F8EF] border border-[#B7E4C3] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Activos</h3>
          <p className="text-3xl font-extrabold text-[#0D784A] mt-1">
            {contacts.filter((c) => c.isActive).length}
          </p>
        </div>

        <div className="bg-[#FDECEC] border border-[#F5C2C2] rounded-2xl shadow-sm p-4 text-center">
          <h3 className="text-sm text-slate-600 font-medium">Inactivos</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-1">
            {contacts.filter((c) => !c.isActive).length}
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <SearchBar
          query={query}
          onChange={setQuery}
          placeholder="Buscar por tipo o valor..."
        />
      </div>

      {/* Listado */}
      <div className="space-y-4 min-h-[200px]">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D784A]"></div>
            <p className="text-gray-500 mt-3">Cargando contactos...</p>
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {query ? (
              <>
                <p className="mb-2">No se encontraron resultados para "{query}"</p>
                <button
                  onClick={() => setQuery("")}
                  className="text-[#0D784A] hover:underline"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <>
                <p className="mb-4">No hay contactos registrados.</p>
                <Button onClick={handleCreate}>+ Crear primer contacto</Button>
              </>
            )}
          </div>
        ) : (
          paged.map((c) => (
            <ContactRow
              key={c.id}
              item={c}
              onEdit={handleEditClick}
              onDelete={(id) => setConfirmDelete(id)}
              onChangeOrder={handleChangeOrder}
              onToggleActive={handleToggleActive}
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
      <ContactFormModal
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
        message="¿Seguro que deseas eliminar este contacto? Esta acción no se puede deshacer."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}