// src/sections/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import AdminLayout from "../layout/admin/AdminLayout";

import HomePage from "../pages/homepage";
import ActivitiesPage from "../pages/activities";
import CooperativaPage from "../pages/cooperativa";
import AdminPage from "../pages/adminpage";
import NotFoundPage from "../pages/notfoundpage";
import UnauthorizedPage from "../pages/unathorizable";
import CategoryMenuPage from "../components/CategoryMenuPage";
import ActivityDetailPage from "../components/Activitydetail";
import GallerySection from "../components/gallerysection";
import MudecoopJRPage from "./cooperativa/mudecoopjr";
import ReforestacionPage from "./cooperativa/reforestacion";
import ManglarPage from "./cooperativa/manglar";
import HistFlotantePage from "./cooperativa/histflotante";
import HistMudecoopPage from "./cooperativa/histmudecoop";
import ProtectedRoute from "../components/admin/auth/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "activities", element: <ActivitiesPage /> },
       { path: "activities/:activityId", element: <ActivityDetailPage /> },
      { path: "cooperativa", element: <CooperativaPage /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "menu/:categoryId", element: <CategoryMenuPage /> },
      { path: "galeria", element: <GallerySection /> },
      { path: "cooperativa/mudecoop-jr", element: <MudecoopJRPage /> },
      { path: "cooperativa/reforestacion", element: <ReforestacionPage /> },
      { path: "cooperativa/tour-de-manglar", element: <ManglarPage /> },
      { path: "cooperativa/hist-rest-flotante", element: <HistFlotantePage /> },
      { path: "cooperativa/hist-mudecoop", element: <HistMudecoopPage /> },
    ],
  },

// Login público
  { path: "/login", element: <LoginPage /> },

  // Panel ADMIN protegido por sesión
  {
    path: "/admin",
    element: (
      <ProtectedRoute redirectTo="/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Si esta página es para cualquier usuario autenticado:
      { index: true, element: <AdminPage /> },

      // 👇 ejemplo de subruta SOLO ADMIN (si la necesitas)
      // {
      //   path: "solo-admin",
      //   element: (
      //     <RoleGuard allow={['ADMIN']} fallbackPath="/unauthorized">
      //       <SoloAdminPage />
      //     </RoleGuard>
      //   ),
      // },
    ],
  },

  // 404 global
  { path: "*", element: <NotFoundPage /> },
]);
