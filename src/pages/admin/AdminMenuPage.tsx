import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../hooks/menu/useCategories";
import { useDishes } from "../../hooks/menu/useDishes";
import DishCard from "../../components/admin/menu/DishCard";
import DishModal from "../../components/admin/menu/DishModal";
import CategoryModal from "../../components/admin/menu/CategoryModal";
import { useCategoryEditor } from "../../hooks/menu/useCategoryEditor";
import { useDishEditor } from "../../hooks/menu/useDishEditor";
import CategoryCards from "../../components/admin/menu/CategoryCards";
import SearchBar from "../../components/admin/menu/SearchBar";
import Pagination from "../../components/admin/menu/Pagination";

export default function AdminMenuPage() {
  const { categories, loading: loadingCats, reload: reloadCats } = useCategories();
  const { dishes, counts, loading: loadingDishes, reload: reloadDishes, setDishes } = useDishes();

  const [selectedCat, setSelectedCat] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  // ---- paginación de categorías
  const CAT_PAGE_SIZE = 4;        // páginas 2..N
  const FIRST_PAGE_REAL = 3;      // página 1: 3 reales + tarjeta “Todos”
  const [catPage, setCatPage] = useState<number>(1);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
    [categories]
  );

  const totalCatPages = useMemo(() => {
    const n = sortedCategories.length;
    if (n <= FIRST_PAGE_REAL) return 1;
    return 1 + Math.ceil((n - FIRST_PAGE_REAL) / CAT_PAGE_SIZE);
  }, [sortedCategories.length]);

  // clamp si cambia el total
  useEffect(() => {
    if (catPage > totalCatPages) setCatPage(totalCatPages);
  }, [catPage, totalCatPages]);

  const pagedCategories = useMemo(() => {
    if (catPage === 1) {
      // primera página: solo 3 reales
      return sortedCategories.slice(0, FIRST_PAGE_REAL);
    }
    // páginas 2..N: 4 por página a partir de los 3 de la primera
    const start = FIRST_PAGE_REAL + (catPage - 2) * CAT_PAGE_SIZE;
    return sortedCategories.slice(start, start + CAT_PAGE_SIZE);
  }, [sortedCategories, catPage]);

  // selección desde CategoryCards
  function handleSelectCategory(id: number | "all") {
    if (id === "all") setCatPage(1); // “Todos” solo vive en la página 1
    setSelectedCat(id);
  }

  const cat = useCategoryEditor({ reloadCats, reloadDishes, categories, selectedCat, setSelectedCat });
  const dish = useDishEditor({ reloadDishes, setDishes, selectedCat });

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])) as Record<number, string>,
    [categories]
  );

  // filtro + orden de platillos
  const filteredDishes = useMemo(() => {
    const base = selectedCat === "all" ? dishes : dishes.filter((d) => d.categoryId === selectedCat);
    const q = query.trim().toLowerCase();
    const byText = q
      ? base.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            (d.description ?? "").toLowerCase().includes(q) ||
            (categoryNameById[d.categoryId] ?? "").toLowerCase().includes(q)
        )
      : base;
    return [...byText].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
  }, [dishes, selectedCat, query, categoryNameById]);

  const loading = loadingCats || loadingDishes;
  const titleSuffix = selectedCat === "all" ? "Todos" : categoryNameById[selectedCat as number] ?? "Categoría";

  function openEditCategoryById(id: number) {
    setSelectedCat(id);
    cat.openEditCategory();
  }
  function deleteCategoryById(id: number) {
    setSelectedCat(id);
    void cat.handleDeleteSelectedCategory();
  }

  return (
    <div className="p-6">
      {/* Header + Acciones arriba */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0D784A]">Gestión del Menú</h1>
          <p className="text-slate-600">Administra las categorías y platillos de tu restaurante</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={cat.openCreateCategory}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            + Nueva Categoría
          </button>
          <button
            onClick={dish.openNewDish}
            className="rounded-xl bg-[#0D784A] px-3 py-2 text-sm font-medium text-white hover:bg-[#0B6A41]"
          >
            + Nuevo Platillo
          </button>
        </div>
      </div>

      <SearchBar query={query} onChange={setQuery} />

      {/* CATEGORÍAS */}
      <section className="mb-6">
        <h2 className="mb-3 text-2xl font-bold text-[#0D784A]">Categorías</h2>

        <CategoryCards
          categories={pagedCategories}            
          selected={selectedCat}
          counts={counts}
          onSelect={handleSelectCategory}
          onEditCategory={openEditCategoryById}
          onDeleteCategory={deleteCategoryById}
          showAllCard={catPage === 1}              
        />

        {totalCatPages > 1 && (
          <div className="mt-5 flex justify-center">
            <Pagination page={catPage} total={totalCatPages} onChange={setCatPage} />
          </div>
        )}
      </section>

      {/* PLATILLOS */}
      <section>
        <h2 className="mb-3 text-2xl font-bold text-[#0D784A]">Platillos – {titleSuffix}</h2>

        <div className="min-h-[120px]">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Cargando…</div>
          ) : filteredDishes.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No hay platillos en esta vista.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDishes.map((d) => (
                <DishCard
                  key={d.id}
                  dish={d}
                  categoryName={categoryNameById[d.categoryId] ?? "—"}
                  onEdit={dish.openEditDish}
                  onDelete={dish.handleDeleteDish}
                  onToggle={dish.handleToggleDish}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODALES */}
      <CategoryModal
        open={cat.openCatModal}
        onClose={() => cat.setOpenCatModal(false)}
        name={cat.catName}
        description={cat.catDesc}
        setName={cat.setCatName}
        setDescription={cat.setCatDesc}
        imageFile={cat.catImage}
        setImageFile={cat.setCatImage}
        currentImageUrl={cat.editingCategory?.imagePath ?? null}
        onRemoveImage={cat.catMode === "edit" ? cat.handleRemoveCategoryImage : undefined}
        onSubmit={cat.handleSaveCategory}
        loading={cat.savingCat}
        mode={cat.catMode}
      />

      <DishModal
        open={dish.openDishModal}
        onClose={() => {
          if (!dish.savingDish) {
            dish.setOpenDishModal(false);
            dish.setEditingDish(null);
          }
        }}
        categories={categories}
        editing={dish.editingDish}
        form={dish.dishForm}
        setForm={dish.setDishForm}
        onSubmit={dish.handleSaveDish}
        loading={dish.savingDish}
      />
    </div>
  );
}
