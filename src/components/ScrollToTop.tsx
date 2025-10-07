// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const action = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'

  useEffect(() => {
    // Solo forzar scroll arriba cuando ENTRAS a una ruta nueva (no al volver)
    if ((action === "PUSH" || action === "REPLACE") && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    // En 'POP' no hacemos nada: dejamos que se restaure la posición previa
  }, [pathname, hash, action]);

  return null;
}
