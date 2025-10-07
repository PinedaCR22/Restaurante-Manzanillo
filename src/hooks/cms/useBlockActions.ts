import type { BlockForm, ContentBlock } from "../../types/cms";
import { CmsService } from "../../services/cms/cms.service";

export function useBlockActions(
  sectionId: number | null,
  blocks: ContentBlock[],
  setBlocks: (next: ContentBlock[]) => void,
  reload: () => Promise<void> | void
) {
  async function create(form: BlockForm, image?: File) {
    if (!sectionId) throw new Error("Seleccione una sección");
    await CmsService.createBlock(sectionId, form, image);
    await reload();
  }

  async function update(blockId: number, form: BlockForm) {
    const updated = await CmsService.updateBlock(blockId, form);
    setBlocks(blocks.map(b => b.id === blockId ? updated : b));
  }

  async function updateImage(blockId: number, image: File) {
    const updated = await CmsService.updateBlockImage(blockId, image);
    setBlocks(blocks.map(b => b.id === blockId ? updated : b));
  }

  async function removeImage(blockId: number) {
    await CmsService.deleteBlockImage(blockId);
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, imagePath: null } : b));
  }

  async function remove(blockId: number) {
    await CmsService.deleteBlock(blockId);
    setBlocks(blocks.filter(b => b.id !== blockId));
  }

  async function move(block: ContentBlock, dir: "up" | "down") {
    const idx = blocks.findIndex(b => b.id === block.id);
    if (idx < 0) return;
    const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(blocks.length - 1, idx + 1);
    if (newIdx === idx) return;

    const reordered = [...blocks];
    const [removed] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, removed);

    const withOrder = reordered.map((it, i) => ({ ...it, displayOrder: i + 1 }));
    setBlocks(withOrder);

    const a = withOrder[newIdx];
    const b = withOrder[idx];
    await Promise.all([
      CmsService.updateBlock(a.id, { displayOrder: a.displayOrder }),
      CmsService.updateBlock(b.id, { displayOrder: b.displayOrder }),
    ]);
  }

  return { create, update, updateImage, removeImage, remove, move };
}
