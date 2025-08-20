import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function HeaderAdmin() {
  const navigate = useNavigate();

  function handleSignOut() {
    navigate("/login", { replace: true });
  }

  return (
    <header className="bg-sky-500 text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + nombre */}
        <Link to="/admin" className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
            alt="MUDECOOP"
            className="h-14 w-14 object-contain rounded-full"
          />
          <span className="font-bold text-2xl tracking-wide">
            Panel administrativo
          </span>
        </Link>

        {/* Botón cerrar sesión */}
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded px-4 py-3 bg-sky-600 hover:bg-sky-700 transition text-lg"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut className="h-6 w-6" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
