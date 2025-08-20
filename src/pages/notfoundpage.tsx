import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <img
        src="https://i.ibb.co/ZjyDL8P/Chat-GPT-Image-19-ago-2025-23-18-31.webp"
        alt="Página no encontrada"
        className="max-w-md w-full mb-6"
      />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Oops... Página no encontrada
      </h1>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
