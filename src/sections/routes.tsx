// src/sections/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainlayout";

// ===== LANDING / PÚBLICO =====
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
import CooperativaDinamicaPage from "../pages/cooperativa-dinamica";


// ===== AUTH =====
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// ===== ADMIN =====
import ProtectedRoute from "../components/admin/auth/ProtectedRoute";
import RoleGuard from "../components/admin/auth/RoleGuard";

import AdminLayout from "../layout/admin/AdminLayout";
import AdminPage from "../pages/admin/adminpage";

import AdminMenuPage from "../pages/admin/AdminMenuPage";
import AdminReservasPage from "../pages/admin/AdminReservasPage.";
import AdminBiografiaPage from "../pages/admin/AdminBiografiaPage";
import AdminActivityPage from "../pages/admin/ActivityPage";
import AdminGaleriaPage from "../pages/admin/AdminGaleriaPage";
import AdminContactoPage from "../pages/admin/AdminContactoPage";
import NotificationsPage from "../pages/admin/NotificationsPage";

// ✅ TUS NUEVOS MÓDULOS
import AdminFaqChatbotPage from "../pages/admin/AdminFaqChatbotPage";
import ConfigPage from "../pages/admin/ConfigPage";
import UsersPage from "../pages/admin/UsersPage";

export const router = createBrowserRouter([
  // =====================================================
  // ✅ LANDING PRINCIPAL
  // =====================================================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "activities", element: <ActivitiesPage /> },
      { path: "activities/:activityId", element: <ActivityDetailPage /> },

      { path: "cooperativa", element: <CooperativaPage /> },
      { path: "cooperativa/:id", element: <CooperativaDinamicaPage /> },
      { path: "cooperativa/mudecoop-jr", element: <MudecoopJRPage /> },
      { path: "cooperativa/reforestacion", element: <ReforestacionPage /> },
      { path: "cooperativa/tour-de-manglar", element: <ManglarPage /> },
      { path: "cooperativa/hist-rest-flotante", element: <HistFlotantePage /> },
      { path: "cooperativa/hist-mudecoop", element: <HistMudecoopPage /> },

      { path: "menu/:categoryId", element: <CategoryMenuPage /> },
      { path: "galeria", element: <GallerySection /> },

      { path: "unauthorized", element: <UnauthorizedPage /> },
    ],
  },

  // =====================================================
  // ✅ AUTENTICACIÓN
  // =====================================================
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // =====================================================
  // ✅ PANEL ADMINISTRATIVO
  // =====================================================
  {
    path: "/admin",
    element: (
      <ProtectedRoute redirectTo="/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },

      // ===== RESTAURANTE =====
      {
        path: "menu",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <AdminMenuPage />
          </RoleGuard>
        ),
      },
      {
        path: "reservas",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <AdminReservasPage />
          </RoleGuard>
        ),
      },
      {
        path: "contacto",
        element: (
          <RoleGuard allow={["ADMIN"]}>
            <AdminContactoPage />
          </RoleGuard>
        ),
      },

      // ===== INFORMACIÓN DEL SITIO =====
      {
        path: "galeria",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <AdminGaleriaPage />
          </RoleGuard>
        ),
      },
      {
        path: "biografia",
        element: (
          <RoleGuard allow={["ADMIN"]}>
            <AdminBiografiaPage />
          </RoleGuard>
        ),
      },
      {
        path: "actividades",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <AdminActivityPage />
          </RoleGuard>
        ),
      },

      // ===== NOTIFICACIONES =====
      {
        path: "notificaciones",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <NotificationsPage />
          </RoleGuard>
        ),
      },

      // ===== ✅ NUEVO: FAQs + CHATBOT =====
      {
        path: "faqs-chatbot",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <AdminFaqChatbotPage />
          </RoleGuard>
        ),
      },

      // ===== ✅ NUEVO: CONFIGURACIÓN USUARIO LOGUEADO =====
      {
        path: "configuracion",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]}>
            <ConfigPage />
          </RoleGuard>
        ),
      },

      // ===== ✅ NUEVO: GESTIÓN DE USUARIOS =====
      {
        path: "usuarios",
        element: (
          <RoleGuard allow={["ADMIN"]}>
            <UsersPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // =====================================================
  // ✅ 404 GLOBAL
  // =====================================================
  { path: "*", element: <NotFoundPage /> },
]);
