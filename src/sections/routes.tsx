// src/sections/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import AdminLayout from "../layout/adminlayout";

import HomePage from "../pages/homepage";
import ActivitiesPage from "../pages/activities";
import CooperativaPage from "../pages/cooperativa";
import AdminPage from "../pages/adminpage";
import LoginPage from "../pages/loginpage";
import NotFoundPage from "../pages/notfoundpage";
import UnauthorizedPage from "../pages/unathorizable";
import CategoryMenuPage from "../components/CategoryMenuPage";
import ActivityDetailPage from "../components/Activitydetail";
import GallerySection from "../components/gallerysection";



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

    ],
  },

  { path: "/login", element: <LoginPage /> },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPage /> },
      // futuras subrutas admin:
      // { path: "reservas", element: <AdminReservations /> },
      // { path: "menu", element: <AdminMenu /> },
    ],
  },

  // 404 global
  { path: "*", element: <NotFoundPage /> },
]);
