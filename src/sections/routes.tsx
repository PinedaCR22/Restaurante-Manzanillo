// src/sections/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import ActivitiesPage from "../pages/activities";
import CooperativaPage from "../pages/cooperativa";
import AdminPage from "../pages/adminpage";
import LoginPage from "../pages/loginpage";
import NotFoundPage from "../pages/notfoundpage";
import UnauthorizedPage from "../pages/unathorizable";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // Rutas principales
      { index: true, element: <HomePage /> },             
      { path: "actividades", element: <ActivitiesPage /> },
      { path: "cooperativa", element: <CooperativaPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "login", element: <LoginPage /> },

      // Accesos
      { path: "*", element: <NotFoundPage /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
    ],
  },
]);
