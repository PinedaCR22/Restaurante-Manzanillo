import { useCallback, useEffect, useState } from "react";
import type { ContentBlock } from "../../types/cms";
import { CmsService } from "../../services/cms/cms.service";

export function useBlocks(sectionId: number | null) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!sectionId) {
      setBlocks([]);
      return;
    }
    setLoading(true);
    try {
      const data = await CmsService.listBlocks(sectionId);
      setBlocks(data);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => { void reload(); }, [reload]);

  return { blocks, setBlocks, loading, reload };
}
