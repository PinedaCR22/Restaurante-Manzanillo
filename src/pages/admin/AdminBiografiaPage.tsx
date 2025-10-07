// src/pages/admin/AdminCmsPage.tsx
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCmsAdmin } from "../../hooks/cms/useCmsAdmin";
import { LABEL_BY_KEY } from "../../constants/cms";
import BlockFormModal from "../../components/admin/cms/BlockFormModal";
import BlockCard from "../../components/admin/cms/BlockCard";

export default function AdminCmsPage() {
  const { tabs, current, setCurrent, sections, blocks, loading, createBlock, reload } = useCmsAdmin();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => LABEL_BY_KEY[current], [current]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-extrabold text-emerald-900">Contenido del Sitio</h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setCurrent(t.key)}
            className={[
              "rounded-xl border px-4 py-2 text-sm",
              current === t.key
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4" /> Nuevo bloque
        </button>
      </div>

      {loading || !sections ? (
        <div className="rounded-xl border border-emerald-200 bg-white p-6 text-center text-emerald-700/70">
          Cargando…
        </div>
      ) : blocks.length === 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          No hay contenido aún en esta sección.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blocks.map((b) => (
            <BlockCard key={b.id} block={b} onChanged={reload} />
          ))}
        </div>
      )}

      {/* Modal crear */}
      <BlockFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (data) => {
          await createBlock(data);
          setOpen(false);
        }}
      />
    </div>
  );
}
