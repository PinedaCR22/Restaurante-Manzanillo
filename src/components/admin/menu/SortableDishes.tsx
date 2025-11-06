import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import DishCard from "./DishCard";
import type { Dish } from "../../../types/menu/dish";
import { MenuService } from "../../../services/menu/menu.service";
import { useToast } from "../../../hooks/useToast";

type Props = {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  onEdit: (d: Dish) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
};

export default function SortableDishes({ dishes, setDishes, onEdit, onDelete, onToggle }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const { push } = useToast();

  async function persistNewOrder(list: Dish[]) {
    try {
      await Promise.all(list.map((d, i) => MenuService.updateDishOrder(d.id, i + 1)));
      push({ type: "success", title: "Orden actualizado" });
    } catch {
      push({ type: "error", title: "No se pudo guardar el orden" });
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setDishes((prev) => {
      const oldIndex = prev.findIndex((x) => x.id === active.id);
      const newIndex = prev.findIndex((x) => x.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex).map((d, i) => ({ ...d, displayOrder: i + 1 }));
      void persistNewOrder(next);
      return next;
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {dishes.map((d) => (
            <SortableItem key={d.id} id={d.id}>
              <DishCard
                dish={d}
                categoryName=""
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
