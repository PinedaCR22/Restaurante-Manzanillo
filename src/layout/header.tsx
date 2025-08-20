import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#443314] text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + nombre */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
            alt="MUDECOOP"
            className="h-14 w-14 object-contain rounded-full"
          />
          <span className="font-bold text-2xl tracking-wide">
            REST. MANZANILLO
          </span>
        </Link>

        {/* Icono usuario */}
        <Link
          to="/login"
          className="p-3 rounded-full hover:bg-[#5c4420] transition-colors"
        >
          <User className="h-7 w-7" />
        </Link>
      </div>
    </header>
  );
}
