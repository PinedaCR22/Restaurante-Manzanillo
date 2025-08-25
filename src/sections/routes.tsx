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
import CategoryMenuPage from "../pages/CategoryMenuPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "actividades", element: <ActivitiesPage /> },
      { path: "cooperativa", element: <CooperativaPage /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "menu/:categoryId", element: <CategoryMenuPage /> },
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
