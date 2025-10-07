import { useState } from "react";
import type { Category } from "../../types/menu/category";
import { MenuService } from "../../services/menu/menu.service";
import { getErrorMessage } from "../../helpers/error";

export function useCategoryEditor({
  reloadCats,
  reloadDishes,
  categories,
  selectedCat,
  setSelectedCat,
}: {
  reloadCats: () => Promise<void> | void;
  reloadDishes: () => Promise<void> | void;
  categories: Category[];
  selectedCat: number | "all";
  setSelectedCat: (id: number | "all") => void;
}) {
  const [openCatModal, setOpenCatModal] = useState(false);
  const [catMode, setCatMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState<File | null>(null);
  const [savingCat, setSavingCat] = useState(false);

  function openCreateCategory() {
    setCatMode("create");
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
    setCatImage(null);
    setOpenCatModal(true);
  }

  function openEditCategory() {
    if (selectedCat === "all") return;
    const cat = categories.find((c) => c.id === selectedCat);
    if (!cat) return;
    setCatMode("edit");
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description ?? "");
    setCatImage(null);
    setOpenCatModal(true);
  }

  async function handleSaveCategory() {
    if (!catName.trim()) return alert("Nombre requerido");
    setSavingCat(true);
    try {
      if (catMode === "create") {
        const created = await MenuService.createCategory({
          name: catName.trim(),
          description: catDesc.trim(),
          isActive: true,
        });
        if (catImage) await MenuService.uploadCategoryImage(created.id, catImage);
        setSelectedCat(created.id);
      } else if (editingCategory) {
        const updated = await MenuService.updateCategory(editingCategory.id, {
          name: catName.trim(),
          description: catDesc.trim(),
        });
        if (catImage) await MenuService.uploadCategoryImage(updated.id, catImage);
      }
      setOpenCatModal(false);
      setCatImage(null);
      await reloadCats();
      await reloadDishes();
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "No se pudo guardar la categoría");
    } finally {
      setSavingCat(false);
    }
  }

  async function handleRemoveCategoryImage() {
    if (!editingCategory) return;
    try {
      await MenuService.removeCategoryImage(editingCategory.id);
      await reloadCats();
    } catch (err: unknown) {
      alert(getErrorMessage(err) || "No se pudo quitar la portada");
    }
  }

  async function handleDeleteSelectedCategory() {
    if (selectedCat === "all") return;
    const cat = categories.find((c) => c.id === selectedCat);
    if (!cat) return;
    if (!confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;

    try {
      await MenuService.deleteCategory(cat.id);
      setSelectedCat("all");
      await reloadCats();
      await reloadDishes();
    } catch (err: unknown) {
      alert(
        getErrorMessage(err) ||
          "No se pudo eliminar la categoría. Si tiene platillos, muévelos o elimínalos primero."
      );
    }
  }

  return {
    // estado
    openCatModal, setOpenCatModal,
    catMode, editingCategory,
    catName, setCatName, catDesc, setCatDesc,
    catImage, setCatImage, savingCat,
    // acciones
    openCreateCategory, openEditCategory,
    handleSaveCategory, handleRemoveCategoryImage, handleDeleteSelectedCategory,
  };
}
