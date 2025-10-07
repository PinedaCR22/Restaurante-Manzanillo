import { useCallback, useEffect, useMemo, useState } from "react";
import { CmsService } from "../../services/cms/cms.service";
import { CORE_SECTIONS, type CoreSectionKey, LABEL_BY_KEY } from "../../constants/cms";
import type { ContentBlock, PageSection } from "../../types/cms";

export function useCmsAdmin() {
  const [sections, setSections] = useState<Record<CoreSectionKey, PageSection> | null>(null);
  const [current, setCurrent] = useState<CoreSectionKey>("mudecoop");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (key: CoreSectionKey) => {
    setLoading(true);
    const s = await CmsService.ensureCoreSections();
    setSections(s);
    const b = await CmsService.listBlocks(s[key].id);
    setBlocks(b);
    setLoading(false);
  }, []);

  useEffect(() => { load(current); }, [current, load]);

  const tabs = useMemo<{ key: CoreSectionKey; label: string }[]>(
    () => CORE_SECTIONS.map(t => ({ key: t.key, label: LABEL_BY_KEY[t.key] })),
    []
  );

  const reload = () => load(current);

  // Crear
  const createBlock = async (form: {
    title?: string;
    body?: string;
    displayOrder?: number;
    isActive?: boolean;
    image?: File | null;
  }) => {
    const { image, ...payload } = form;
    await CmsService.createBlockByKey(current, payload, image ?? undefined);
    await reload();
  };

  // Editar
  const editBlock = async (
    blockId: number,
    form: {
      title?: string;
      body?: string;
      displayOrder?: number;
      isActive?: boolean;
      image?: File | null;
    }
  ) => {
    const { image, ...payload } = form;
    await CmsService.updateBlock(blockId, payload);
    if (image) {
      await CmsService.updateBlockImage(blockId, image);
    }
    await reload();
  };

  // Eliminar
  const deleteBlock = async (blockId: number) => {
    await CmsService.deleteBlock(blockId);
    await reload();
  };

  return {
    tabs,
    current,
    setCurrent,
    sections,
    blocks,
    loading,
    reload,
    createBlock,
    editBlock,
    deleteBlock,
  };
}
