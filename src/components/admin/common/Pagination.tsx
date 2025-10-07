// src/components/admin/common/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function getPages(page: number, total: number) {
  // mostramos: 1 … (p-1) p (p+1) … total   (máx ~7 items visuales)
  const pages = new Set<number>([1, total, page]);
  if (page - 1 > 1) pages.add(page - 1);
  if (page - 2 > 1) pages.add(page - 2);
  if (page + 1 < total) pages.add(page + 1);
  if (page + 2 < total) pages.add(page + 2);

  return Array.from(pages).sort((a, b) => a - b);
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav className="mt-5 flex items-center justify-center gap-1" aria-label="Paginación">
      {/* Anterior */}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
      </button>

      {/* Números con elipsis */}
      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showDots = idx > 0 && prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="inline-flex">
            {showDots && <span className="px-1.5 text-slate-500">…</span>}
            <button
              type="button"
              onClick={() => onChange(p)}
              className={[
                "rounded-md px-3 py-1.5 text-sm",
                p === page
                  ? "bg-green-800 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </span>
        );
      })}

      {/* Siguiente */}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <span>Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
