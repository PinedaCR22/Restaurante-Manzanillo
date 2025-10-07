import { useCallback, useEffect, useState } from "react";
import type { PageSection } from "../../types/cms";
import { CmsService } from "../../services/cms/cms.service";

export function useSections() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CmsService.listSections();
      setSections(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  return { sections, loading, reload, setSections };
}
