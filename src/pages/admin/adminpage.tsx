// src/pages/adminpage.tsx
export default function AdminPage() {
  return (
    <div className="p-6 lg:p-10 space-y-6 bg-[#F8FAF8] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0D784A]">
        Panel Administrativo
      </h1>
      <p className="text-neutral-600">
        Bienvenido al panel. Aquí podrás administrar todos los módulos del sistema.
      </p>

      {/* Ejemplo de tarjeta de contenido */}
      <div className="rounded-xl bg-white shadow-md border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-[#1E293B]">
          Últimas acciones
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Aquí irán listadas las últimas acciones realizadas en el sistema.
        </p>
      </div>
    </div>
  );
}
