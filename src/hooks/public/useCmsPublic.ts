// src/hooks/public/useCmsPublic.ts
import { useEffect, useMemo, useState } from "react";
import { CmsPublicService, fileURL } from "../../services/public/cms-public.service";
import type { PageSection, ContentBlock } from "../../types/cms";

export type SectionWithBlocks = PageSection & { blocks: ContentBlock[] };

export function useCmsSection(key: "mudecoop" | "turismo") {
  const [data, setData] = useState<SectionWithBlocks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const s = await CmsPublicService.getSectionByKey(key);
        if (alive) {
          setData(s);
          setError(null);
        }
      } catch (e) {
        if (alive) setError((e as Error).message || "Error cargando contenido");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [key]);

  return { data, loading, error };
}

/** Selectores reutilizables para no poner lógica en las pages */
export function useCmsSelectors(section: SectionWithBlocks | null) {
  const blocks = section?.blocks ?? [];

  const findByTitle = (needle: string) =>
    blocks.find(
      (b) => (b.title ?? "").trim().toLowerCase().includes(needle.trim().toLowerCase()),
    ) ?? null;

  const first = blocks[0] ?? null;

  const getImageUrl = (b?: ContentBlock | null, bust = false) =>
    b?.imagePath ? fileURL(b.imagePath, bust) : "";

  return useMemo(
    () => ({
      blocks,
      first,
      findByTitle,
      getImageUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(blocks)],
  );
}
