import { useMemo, useState } from "react";

type Props = {
  /** Lista de URLs candidatas; probará en orden hasta encontrar una que cargue. */
  candidates: string[];
  alt?: string;
  className?: string;
  /** Si true, muestra un fondo gris mientras carga. */
  skeleton?: boolean;
};

export default function SafeImg({ candidates, alt = "", className, skeleton = false }: Props) {
  const urls = useMemo(() => candidates.filter(Boolean), [candidates]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  if (urls.length === 0) return null;

  return (
    <div className={className} style={{ position: "relative" }}>
      {skeleton && loading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}
      <img
        src={urls[idx]}
        alt={alt}
        className="h-full w-full object-cover"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setIdx((i) => (i + 1 < urls.length ? i + 1 : i));
        }}
      />
    </div>
  );
}
