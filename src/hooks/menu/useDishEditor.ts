// src/hooks/useDishEditor.ts
import { useState } from "react";
import type { Dish } from "../../types/menu/dish";
import type { DishEditorForm } from "../../types/menu/forms";
import { MenuService } from "../../services/menu/menu.service";

type Params = {
  reloadDishes: () => Promise<void> | void;
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  selectedCat: number | "all";
};

export function useDishEditor({ reloadDishes, setDishes, selectedCat }: Params) {
  const [openDishModal, setOpenDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [savingDish, setSavingDish] = useState(false);

  const [dishForm, setDishForm] = useState<DishEditorForm>({
    name: "",
    price: 0,
    categoryId: "" as number | "",
    description: "",
    isActive: true,
    displayOrder: undefined,
  });

  function openNewDish() {
    setEditingDish(null);
    setDishForm({
      name: "",
      price: 0,
      categoryId: selectedCat === "all" ? "" : selectedCat,
      description: "",
      isActive: true,
      displayOrder: undefined,
    });
    setOpenDishModal(true);
  }

  function openEditDish(d: Dish) {
    setEditingDish(d);
    setDishForm({
      name: d.name,
      price: Number(d.price),
      categoryId: d.categoryId,
      description: d.description ?? "",
      isActive: d.isActive === true || d.isActive === 1,
      displayOrder: d.displayOrder,
    });
    setOpenDishModal(true);
  }

  async function handleSaveDish() {
    if (!dishForm.name.trim()) return alert("Nombre requerido");
    if (!dishForm.categoryId) return alert("Categoría requerida");

    setSavingDish(true);
    try {
      if (editingDish) {
        await MenuService.updateDish(editingDish.id, {
          name: dishForm.name.trim(),
          price: Number(dishForm.price),
          categoryId: Number(dishForm.categoryId),
          description: dishForm.description?.trim(),
          isActive: !!dishForm.isActive,
          displayOrder: dishForm.displayOrder,
        });
      } else {
        await MenuService.createDish({
          name: dishForm.name.trim(),
          price: Number(dishForm.price),
          categoryId: Number(dishForm.categoryId),
          description: dishForm.description?.trim(),
          isActive: !!dishForm.isActive,
          displayOrder: dishForm.displayOrder,
        });
      }
      setOpenDishModal(false);
      setEditingDish(null);
      await reloadDishes();
    } finally {
      setSavingDish(false);
    }
  }

  async function handleDeleteDish(id: number) {
    if (!confirm("¿Eliminar platillo?")) return;
    await MenuService.deleteDish(id);
    await reloadDishes();
  }

  async function handleToggleDish(id: number, value: boolean) {
    await MenuService.updateDishVisibility(id, value);
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, isActive: value } as Dish : d)));
  }

  return {
    // state
    openDishModal,
    setOpenDishModal,
    editingDish,
    setEditingDish,
    dishForm,
    setDishForm,
    savingDish,

    // actions
    openNewDish,
    openEditDish,
    handleSaveDish,
    handleDeleteDish,
    handleToggleDish,
  };
}
