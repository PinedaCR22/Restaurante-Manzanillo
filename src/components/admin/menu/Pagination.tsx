type Props = {
  page: number;
  total: number;
  onChange: (p: number) => void;
};

function makeRange(page: number, total: number) {
  const pages: (number | "dots")[] = [];
  const push = (x: number | "dots") => pages.push(x);

  const add = (n: number) => {
    if (n >= 1 && n <= total) push(n);
  };

  add(1);
  if (page - 2 > 2) push("dots");
  add(page - 1);
  add(page);
  add(page + 1);
  if (page + 2 < total - 1) push("dots");
  if (total > 1) add(total);

  return pages.filter((v, i, a) => (i === 0 ? true : v !== a[i - 1]));
}

export default function Pagination({ page, total, onChange }: Props) {
  const items = makeRange(page, total);

  return (
    <nav className="inline-flex items-center gap-1" aria-label="Paginación">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
      >
        ‹ Anterior
      </button>

      {items.map((it, idx) =>
        it === "dots" ? (
          <span key={`d${idx}`} className="px-2 text-slate-500">…</span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm",
              it === page
                ? "bg-[#0D784A] text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {it}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
      >
        Siguiente ›
      </button>
    </nav>
  );
}
