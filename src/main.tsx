// src/main.tsx
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./sections/routes";
import "./index.css";
import "./i18n/config";

import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./hooks/ToastProvider";
import ToastViewport from "./components/ui/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastViewport />
        </AuthProvider>
      </ToastProvider>
    </Suspense>
  </StrictMode>
);
