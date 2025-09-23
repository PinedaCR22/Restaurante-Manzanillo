// src/sections/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainlayout";


import HomePage from "../pages/homepage";
import ActivitiesPage from "../pages/activities";
import CooperativaPage from "../pages/cooperativa";
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

import AdminPage from "../pages/admin/adminpage";
import AdminLayout from "../layout/admin/AdminLayout";
import AdminMenuPage from "../pages/admin/AdminMenuPage";
import AdminReservasPage from "../pages/admin/AdminReservasPage.";
import AdminBiografiaPage from "../pages/admin/AdminBiografiaPage";
import AdminGaleriaPage from "../pages/admin/AdminGaleriaPage";
import AdminContactoPage from "../pages/admin/AdminContactoPage";
import RoleGuard from "../components/admin/auth/RoleGuard";
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';



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
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // Panel ADMIN protegido por sesión
  {
  path: "/admin",
  element: (
    <ProtectedRoute redirectTo="/login">
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminPage /> }, // visible para cualquier autenticado

 {
        path: "menu",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminMenuPage />
          </RoleGuard>
        ),
      },

      // Reservas: ADMIN y EDITOR
      {
        path: "reservas",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminReservasPage />
          </RoleGuard>
        ),
      },

      // Biografía: solo ADMIN
      {
        path: "biografia",
        element: (
          <RoleGuard allow={["ADMIN"]} fallbackPath="/unauthorized">
            <AdminBiografiaPage />
          </RoleGuard>
        ),
      },

      // Galería: ADMIN y EDITOR
      {
        path: "galeria",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminGaleriaPage />
          </RoleGuard>
        ),
      },

      // Contacto: solo ADMIN (ajústalo si quieres)
      {
        path: "contacto",
        element: (
          <RoleGuard allow={["ADMIN"]} fallbackPath="/unauthorized">
            <AdminContactoPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // 404 global
  { path: "*", element: <NotFoundPage /> },
]);
