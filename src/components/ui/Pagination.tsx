type Props = {
  page: number;
  total: number;
  onChange: (p: number) => void;
};

function makeRange(page: number, total: number): (number | "dots")[] {
  const result: (number | "dots")[] = [];
  const add = (x: number | "dots") => result.push(x);

  const range = (a: number, b: number) => {
    for (let i = a; i <= b; i++) add(i);
  };

  if (total <= 5) range(1, total);
  else if (page <= 3) {
    range(1, 4);
    add("dots");
    add(total);
  } else if (page >= total - 2) {
    add(1);
    add("dots");
    range(total - 3, total);
  } else {
    add(1);
    add("dots");
    range(page - 1, page + 1);
    add("dots");
    add(total);
  }

  return result;
}

export default function Pagination({ page, total, onChange }: Props) {
  const items = makeRange(page, total);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm mt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        ‹ Anterior
      </button>

      {items.map((it, idx) =>
        it === "dots" ? (
          <span key={idx} className="px-2 text-gray-500 select-none">
            …
          </span>
        ) : (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              it === page
                ? "bg-[#0D784A] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {it}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        Siguiente ›
      </button>
    </div>
  );
}
