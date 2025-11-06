import { useMemo, useState } from "react";
import { ChefHat, Pencil, Trash2 } from "lucide-react";
import type { Category } from "../../../types/menu/category";
import { resolveImageUrl } from "../../../helpers/media";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";

const IMG = 96;

function CollageThumb({ urls }: { urls: string[] }) {
  const pics = urls.slice(0, 4);
  return (
    <div
      className="grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
      style={{ width: IMG, height: IMG }}
    >
      {pics.length > 0 ? (
        pics.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ))
      ) : (
        <div className="flex items-center justify-center col-span-2 row-span-2 text-gray-400">
          <ChefHat className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

function CategoryThumb({ src }: { src: string | null }) {
  return src ? (
    <img
      src={src}
      alt=""
      className="rounded-xl border border-gray-200 object-cover"
      style={{ width: IMG, height: IMG }}
      loading="lazy"
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50"
      style={{ width: IMG, height: IMG }}
    >
      <ChefHat className="h-6 w-6 text-[#0D784A]" />
    </div>
  );
}

export default function CategoryCards({
  categories,
  allCategoriesForCollage,
  selected,
  counts,
  onSelect,
  onEditCategory,
  onDeleteCategory,
  showAllCard = true,
}: {
  categories: Category[];
  allCategoriesForCollage: Category[];
  selected: number | "all";
  counts: Record<number | "all", number>;
  onSelect: (id: number | "all") => void;
  onEditCategory: (id: number) => void;
  onDeleteCategory: (id: number) => void;
  showAllCard?: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");

  const collageUrls = useMemo(
    () =>
      allCategoriesForCollage
        .slice(0, 4)
        .map((c) => resolveImageUrl(c.imagePath ?? null))
        .filter((u): u is string => !!u),
    [allCategoriesForCollage]
  );

  const sorted = useMemo(
    () =>
      [...categories].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.id - b.id
      ),
    [categories]
  );

  function handleConfirmDelete(id: number) {
    onDeleteCategory(id);
    setConfirmDelete(null);
  }

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
        className={`relative rounded-2xl border p-4 bg-white shadow-sm hover:shadow-md hover:border-[#0D784A]/40 transition
          ${
            active
              ? "border-[#0D784A] ring-2 ring-[#0D784A]/20"
              : "border-gray-200"
          }
        `}
      >
        <span className="absolute right-3 top-3 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
          {count} items
        </span>
        <div className="flex items-center gap-4">
          {left}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {actions && <div className="mt-4 flex gap-2 flex-wrap">{actions}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {showAllCard && (
          <Card
            active={selected === "all"}
            onClick={() => onSelect("all")}
            left={<CollageThumb urls={collageUrls} />}
            title="Todos"
            count={counts["all"] ?? 0}
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
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(c.id);
                    }}
                  >
                    <Pencil size={14} className="mr-1" />
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(c.id);
                      setSelectedName(c.name);
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Eliminar
                  </Button>
                </div>
              }
            />
          );
        })}
      </div>

      {/* ConfirmDialog agregado */}
      <ConfirmDialog
        open={!!confirmDelete}
        message={`¿Eliminar la categoría "${selectedName}"?`}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete !== null) return handleConfirmDelete(confirmDelete);
        }}
      />
    </>
  );
}
