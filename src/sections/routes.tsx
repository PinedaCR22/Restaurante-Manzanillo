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
import RoleGuard from "../components/admin/auth/RoleGuard";

import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import AdminLayout from "../layout/admin/AdminLayout";
import AdminPage from "../pages/admin/adminpage";
import AdminMenuPage from "../pages/admin/AdminMenuPage";
import AdminReservasPage from "../pages/admin/AdminReservasPage.";
import AdminBiografiaPage from "../pages/admin/AdminBiografiaPage";
import AdminActivityPage from "../pages/admin/ActivityPage";
import AdminGaleriaPage from "../pages/admin/AdminGaleriaPage";
import AdminContactoPage from "../pages/admin/AdminContactoPage";
import NotificationsPage from "../pages/admin/NotificationsPage";
import AdminFaqChatbotPage from "../pages/admin/AdminFaqChatbotPage";

// 🔹 Usuarios
import UsersPage from "../pages/admin/UsersPage";
import ConfigPage from "../pages/admin/ConfigPage";

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

  // 🔒 Autenticación pública
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // 🔐 Panel administrativo
  {
    path: "/admin",
    element: (
      <ProtectedRoute redirectTo="/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },

      {
        path: "notificaciones",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <NotificationsPage />
          </RoleGuard>
        ),
      },

      {
        path: "menu",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminMenuPage />
          </RoleGuard>
        ),
      },

      {
        path: "reservas",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminReservasPage />
          </RoleGuard>
        ),
      },

      {
        path: "actividades",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminActivityPage />
          </RoleGuard>
        ),
      },

      {
        path: "biografia",
        element: (
          <RoleGuard allow={["ADMIN"]} fallbackPath="/unauthorized">
            <AdminBiografiaPage />
          </RoleGuard>
        ),
      },

      {
        path: "galeria",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminGaleriaPage />
          </RoleGuard>
        ),
      },

      {
        path: "contacto",
        element: (
          <RoleGuard allow={["ADMIN"]} fallbackPath="/unauthorized">
            <AdminContactoPage />
          </RoleGuard>
        ),
      },

      // 🔹 Centro de Ayuda - FAQs y Chatbot (NUEVA RUTA)
      {
        path: "faqs-chatbot",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <AdminFaqChatbotPage />
          </RoleGuard>
        ),
      },

      // 🔹 Configuración personal (todos los usuarios autenticados)
      {
        path: "configuracion",
        element: (
          <RoleGuard allow={["ADMIN", "EDITOR"]} fallbackPath="/unauthorized">
            <ConfigPage />
          </RoleGuard>
        ),
      },

      // 🔹 Gestión de usuarios (solo ADMIN)
      {
        path: "usuarios",
        element: (
          <RoleGuard allow={["ADMIN"]} fallbackPath="/unauthorized">
            <UsersPage />
          </RoleGuard>
        ),
      },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);