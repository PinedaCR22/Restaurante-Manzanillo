import { useEffect, useMemo, useState } from "react";
import ContactFormModal from "../../components/admin/contact/ContactFormModal";
import ContactRow from "../../components/admin/contact/ContactRow";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/admin/menu/SearchBar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { ContactItem, ContactForm } from "../../types/contact/contact";

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContactItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // 🔹 Simulación de datos
  useEffect(() => {
    setTimeout(() => {
      setContacts([
        { id: 1, kind: "phone", value: "+506 8888-8888", displayOrder: 1, isActive: true },
        { id: 2, kind: "email", value: "info@restaurant.com", displayOrder: 2, isActive: true },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  // 🔍 Filtros con soporte en español e inglés
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Traducciones al español
    const traducciones: Record<string, string[]> = {
      phone: ["teléfono", "telefono", "celular", "móvil", "movil", "whatsapp"],
      email: ["correo", "email", "mail"],
      facebook: ["facebook", "red social"],
      instagram: ["instagram", "ig"],
      web: ["sitio", "página", "pagina", "web", "website"],
      location: ["ubicación", "direccion", "dirección", "mapa"],
    };

    const matchTraduccion = (kind: string) => {
      const alias = traducciones[kind] || [];
      return alias.some((a) => a.includes(q)) || kind.includes(q);
    };

    const base = q
      ? contacts.filter(
          (c) =>
            matchTraduccion(c.kind.toLowerCase()) ||
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

  function handleEdit(item: ContactItem) {
    setEditing(item);
    setModalOpen(true);
  }

  function handleSave(payload: ContactForm) {
    if (editing) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...editing, ...payload } : c))
      );
    } else {
      const newItem = {
        ...payload,
        id: Date.now(),
      } as ContactItem;
      setContacts((prev) => [...prev, newItem]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: number) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setConfirmDelete(null);
  }

  function handleChangeOrder(id: number, order: number) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, displayOrder: order } : c))
    );
  }

  function handleToggleActive(id: number, active: boolean) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: active } : c))
    );
  }

  // ===============================
  // 🧩 INTERFAZ VISUAL (Reservas style)
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

      {/* Tarjetas de resumen (idénticas a reservas) */}
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
          <p className="text-center text-gray-500 py-8">Cargando…</p>
        ) : paged.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay contactos registrados.
          </p>
        ) : (
          paged.map((c) => (
            <ContactRow
              key={c.id}
              item={c}
              onEdit={handleEdit}
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
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />

      {/* Confirmación eliminar */}
      <ConfirmDialog
  open={!!confirmDelete}
  message="¿Seguro que deseas eliminar este contacto?"
  onCancel={() => setConfirmDelete(null)}
  onConfirm={async () => {
    if (confirmDelete !== null) {
      handleDelete(confirmDelete);
      setConfirmDelete(null);
    }
  }}
/>

    </section>
  );
}
