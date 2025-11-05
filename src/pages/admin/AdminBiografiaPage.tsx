import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCmsAdmin } from "../../hooks/cms/useCmsAdmin";
import { LABEL_BY_KEY } from "../../constants/cms";
import BlockFormModal from "../../components/admin/cms/BlockFormModal";
import BlockCard from "../../components/admin/cms/BlockCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";

export default function AdminCmsPage() {
  const { tabs, current, setCurrent, sections, blocks, loading, createBlock, reload } = useCmsAdmin();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ open: boolean; message: string; onConfirm?: () => void }>({
    open: false,
    message: "",
  });

  const title = useMemo(() => LABEL_BY_KEY[current], [current]);

  function askConfirm(message: string, onConfirm: () => void) {
    setConfirm({ open: true, message, onConfirm });
  }

  function handleConfirm() {
    if (confirm.onConfirm) confirm.onConfirm();
    setConfirm({ open: false, message: "" });
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      {/* 🔹 Título principal */}
      <h1 className="mb-4 text-2xl font-bold text-[#0D784A]">Contenido del Sitio</h1>

      {/* 🔹 Tabs estilo línea inferior */}
      <div className="border-b border-[#C6E3D3] mb-8 flex flex-wrap items-center gap-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setCurrent(t.key)}
            className={`relative pb-2 text-sm font-medium transition-all duration-200 
              ${
                current === t.key
                  ? "text-[#0D784A] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#0D784A]"
                  : "text-[#0D784A]/60 hover:text-[#0D784A]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 🔹 Header de sección */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-[#0D784A]">{title}</h2>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-1">
          <Plus size={16} />
          Nuevo bloque
        </Button>
      </div>

      {/* 🔹 Contenido */}
      {loading || !sections ? (
        <div className="rounded-2xl border border-[#C6E3D3] bg-white p-6 text-center text-[#0D784A]/70 shadow-sm">
          Cargando…
        </div>
      ) : blocks.length === 0 ? (
        <div className="rounded-2xl border border-[#C6E3D3] bg-[#E6F4EE] p-6 text-[#0D784A] shadow-sm">
          No hay contenido aún en esta sección.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blocks.map((b) => (
            <BlockCard key={b.id} block={b} onChanged={reload} askConfirm={askConfirm} />
          ))}
        </div>
      )}

      {/* 🔹 Modal crear */}
      <BlockFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (data) => {
          await createBlock(data);
          setOpen(false);
        }}
      />

      {/* 🔹 ConfirmDialog */}
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onCancel={() => setConfirm({ open: false, message: "" })}
        onConfirm={handleConfirm}
      />
    </section>
  );
}
