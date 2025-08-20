import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <img
        src="https://i.ibb.co/NPR6QB8/Chat-GPT-Image-19-ago-2025-23-20-56.webp"
        alt="Acceso no autorizado"
        className="max-w-md w-full mb-6"
      />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Acceso no autorizado
      </h1>
      <Link
        to="/login"
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
      >
        Ir al login
      </Link>
    </div>
  );
}
