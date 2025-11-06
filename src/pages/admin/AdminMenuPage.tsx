import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../hooks/menu/useCategories";
import { useDishes } from "../../hooks/menu/useDishes";
import CategoryCards from "../../components/admin/menu/CategoryCards";
import DishCard from "../../components/admin/menu/DishCard";
import CategoryModal from "../../components/admin/menu/CategoryModal";
import DishModal from "../../components/admin/menu/DishModal";
import { useCategoryEditor } from "../../hooks/menu/useCategoryEditor";
import { useDishEditor } from "../../hooks/menu/useDishEditor";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/admin/menu/SearchBar";
import Button from "../../components/ui/Button";

export default function AdminMenuPage() {
  const { categories, loading: loadingCats, reload: reloadCats } = useCategories();
  const { dishes, counts, loading: loadingDishes, reload: reloadDishes, setDishes } = useDishes();

  const [selectedCat, setSelectedCat] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  // ============================
  // PAGINACIÓN DE CATEGORÍAS
  // ============================
  const FIRST_PAGE_REAL = 3;
  const CAT_PAGE_SIZE = 4;
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

  useEffect(() => {
    if (catPage > totalCatPages) setCatPage(totalCatPages);
  }, [catPage, totalCatPages]);

  const pagedCategories = useMemo(() => {
    if (catPage === 1) return sortedCategories.slice(0, FIRST_PAGE_REAL);
    const start = FIRST_PAGE_REAL + (catPage - 2) * CAT_PAGE_SIZE;
    return sortedCategories.slice(start, start + CAT_PAGE_SIZE);
  }, [sortedCategories, catPage]);

  // ============================
  // HOOKS Y FILTROS
  // ============================
  const cat = useCategoryEditor({
    reloadCats,
    reloadDishes,
    categories,
    selectedCat,
    setSelectedCat,
  });

  const dish = useDishEditor({
    reloadDishes,
    setDishes,
    selectedCat,
  });

  const handleSelectCategory = (id: number | "all") => {
    if (id === "all") setCatPage(1);
    setSelectedCat(id);
    setDishPage(1);
  };

  const categoryNameById = useMemo(
    () =>
      Object.fromEntries(categories.map((c) => [c.id, c.name])) as Record<number, string>,
    [categories]
  );

  const filteredDishes = useMemo(() => {
    const base =
      selectedCat === "all"
        ? dishes
        : dishes.filter((d) => d.categoryId === selectedCat);
    const q = query.trim().toLowerCase();
    const byText = q
      ? base.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            (d.description ?? "").toLowerCase().includes(q) ||
            (categoryNameById[d.categoryId] ?? "").toLowerCase().includes(q)
        )
      : base;
    return [...byText].sort(
      (a, b) => a.displayOrder - b.displayOrder || a.id - b.id
    );
  }, [dishes, selectedCat, query, categoryNameById]);

  // ============================
  // PAGINACIÓN DE PLATILLOS
  // ============================
  const DISH_PAGE_SIZE = 6;
  const [dishPage, setDishPage] = useState(1);
  const totalDishPages = Math.max(
    1,
    Math.ceil(filteredDishes.length / DISH_PAGE_SIZE)
  );

  useEffect(() => {
    if (dishPage > totalDishPages) setDishPage(totalDishPages);
  }, [dishPage, totalDishPages]);

  const pagedDishes = useMemo(() => {
    const start = (dishPage - 1) * DISH_PAGE_SIZE;
    return filteredDishes.slice(start, start + DISH_PAGE_SIZE);
  }, [filteredDishes, dishPage]);

  const loading = loadingCats || loadingDishes;
  const titleSuffix =
    selectedCat === "all"
      ? "Todos"
      : categoryNameById[selectedCat as number] ?? "Categoría";

  // ============================
  // UI PRINCIPAL
  // ============================
  return (
    <section className="max-w-6xl mx-auto p-6">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-[#0D784A]">
  Gestión del Menú
</h1>



    <div className="flex gap-3">
      <Button variant="secondary" onClick={cat.openCreateCategory}>
        + Nueva Categoría
      </Button>
      <Button variant="primary" onClick={dish.openNewDish}>
        + Nuevo Platillo
      </Button>
    </div>
  </div>

  <p className="text-gray-700 text-base mb-6">
    Administra las categorías y platillos de tu restaurante
  </p>


      {/* BUSCADOR */}
      <div className="mb-6">
        <SearchBar
          query={query}
          onChange={setQuery}
          placeholder="Buscar platillos o categorías..."
        />
      </div>

      {/* CATEGORÍAS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
          Categorías
        </h2>

        <CategoryCards
          categories={pagedCategories}
          allCategoriesForCollage={sortedCategories}
          selected={selectedCat}
          counts={counts}
          onSelect={handleSelectCategory}
          onEditCategory={(id) => {
            setSelectedCat(id);
            cat.openEditCategory();
          }}
          onDeleteCategory={(id) => {
            setSelectedCat(id);
            void cat.handleDeleteSelectedCategory();
          }}
          showAllCard={catPage === 1}
        />

        {totalCatPages > 1 && (
          <div className="mt-5 flex justify-center">
            <Pagination
              page={catPage}
              total={totalCatPages}
              onChange={setCatPage}
            />
          </div>
        )}
      </div>

      {/* PLATILLOS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
          Platillos – {titleSuffix}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando platillos...</p>
        ) : pagedDishes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay platillos registrados.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pagedDishes.map((d) => (
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

        {totalDishPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={dishPage}
              total={totalDishPages}
              onChange={setDishPage}
            />
          </div>
        )}
      </div>

      {/* MODAL DE CATEGORÍA */}
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
        onRemoveImage={
          cat.catMode === "edit" ? cat.handleRemoveCategoryImage : undefined
        }
        onSubmit={cat.handleSaveCategory}
        loading={cat.savingCat}
        mode={cat.catMode}
      />

      {/* MODAL DE PLATILLO */}
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
    </section>
  );
}
