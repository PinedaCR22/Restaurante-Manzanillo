import { Outlet } from "react-router-dom";
import HeaderAdmin from "./headeradmin";
import Footer from "./footer";

export default function AdminLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header del área administrativa */}
      <HeaderAdmin />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer compartido */}
      <Footer />
    </div>
  );
}
