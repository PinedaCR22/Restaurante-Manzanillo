import { ChefHat, Pencil, Trash2 } from "lucide-react";
import type { Category } from "../../../types/menu/category";
import { resolveImageUrl } from "../../../helpers/media";
import { useMemo } from "react";

/** Tamaño del thumbnail (ajústalo si quieres) */
const IMG = 96;

/** Collage 2x2 para la tarjeta "Todos" */
function CollageThumb({ urls }: { urls: string[] }) {
  const pics = urls.slice(0, 4);
  if (pics.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
        style={{ width: IMG, height: IMG }}
      >
        <ChefHat className="h-6 w-6 text-[#0D784A]" />
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-slate-200"
      style={{ width: IMG, height: IMG }}
    >
      {pics.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
      ))}
    </div>
  );
}

/** Thumb de categoría individual */
function CategoryThumb({ src }: { src: string | null }) {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
        style={{ width: IMG, height: IMG }}
      >
        <ChefHat className="h-6 w-6 text-[#0D784A]" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="rounded-xl border border-slate-200 object-cover"
      style={{ width: IMG, height: IMG }}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

type Props = {
  categories: Category[];
  selected: number | "all";
  counts: Record<number | "all", number>;
  onSelect: (id: number | "all") => void;
  onEditCategory: (id: number) => void;
  onDeleteCategory: (id: number) => void;
  /** Si true, muestra la tarjeta "Todos". Úsalo como (page === 1). */
  showAllCard?: boolean;
};

export default function CategoryCards({
  categories,
  selected,
  counts,
  onSelect,
  onEditCategory,
  onDeleteCategory,
  showAllCard = true,
}: Props) {
  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    [categories]
  );

  // URLs de portada disponibles (para el collage de "Todos")
  const collageUrls = useMemo(
    () =>
      sorted
        .map((c) => resolveImageUrl(c.imagePath ?? null))
        .filter((u): u is string => !!u),
    [sorted]
  );

  function Card({
    active,
    onClick,
    left,
    title,
    count,
    actions,
  }: {
    active?: boolean;
    onClick: () => void;
    left: React.ReactNode;
    title: string;
    count: number;
    actions?: React.ReactNode;
  }) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
        className={[
          "relative rounded-2xl border bg-white p-3 shadow-sm transition",
          active
            ? "border-[#0D784A] ring-2 ring-[#0D784A]/25"
            : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      >
        <span className="absolute right-3 top-3 rounded-full bg-amber-300 px-2 py-0.5 text-xs font-medium text-amber-900">
          {count} items
        </span>

        <div className="flex items-center gap-4">
          {left}
          <div className="min-w-0">
            <div className="truncate text-xl font-semibold text-slate-900">{title}</div>
          </div>
        </div>

        {actions && <div className="mt-3 flex gap-2">{actions}</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* "Todos" solo si showAllCard === true */}
      {showAllCard && (
        <Card
          active={selected === "all"}
          onClick={() => onSelect("all")}
          left={<CollageThumb urls={collageUrls} />}
          title="Todos"
          count={counts["all"] ?? 0}
          actions={<div className="h-9" />}
        />
      )}

      {sorted.map((c) => {
        const src = resolveImageUrl(c.imagePath ?? null);
        const isActive = selected === c.id;
        return (
          <Card
            key={c.id}
            active={isActive}
            onClick={() => onSelect(c.id)}
            left={<CategoryThumb src={src} />}
            title={c.name}
            count={counts[c.id] ?? 0}
            actions={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(c.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(c.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            }
          />
        );
      })}
    </div>
  );
}
