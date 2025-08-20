export default function Footer() {
  return (
    <footer className="bg-[#443314] text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        {/* Logo arriba */}
        <img
          src="https://i.ibb.co/b5ZY3Rb9/mudecoop.webp"
          alt="MUDECOOP"
          className="h-12 w-12 object-contain rounded-full mx-auto mb-4"
        />

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
          {/* Columna 1 */}
          <div className="max-w-xs">
            <h2 className="text-white font-semibold mb-3">Rest. Manzanillo</h2>
            <p className="text-sm leading-relaxed">
              Restaurante flotante en Manzanillo. Ecoturismo y gastronomía sostenible.
            </p>
          </div>

          {/* Columna 2 */}
          <div className="max-w-xs">
            <h2 className="text-white font-semibold mb-3">Enlaces rápidos</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="/menu" className="hover:underline">Menú</a></li>
              <li><a href="/reservar" className="hover:underline">Reservar</a></li>
              <li><a href="/cooperativa" className="hover:underline">Mudecoop</a></li>
              <li><a href="/actividades" className="hover:underline">Turismo</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="max-w-xs">
            <h2 className="text-white font-semibold mb-3">Contacto</h2>
            <p className="text-sm">Manzanillo, Puntarenas, CR</p>
            <p className="text-sm">Tel: +506 8800-0312</p>
            <p className="text-sm">mudecooprl@outlook.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white text-center text-sm py-4">
        © {new Date().getFullYear()} MUDECOOP R.L. – Todos los derechos reservados.
      </div>
    </footer>
  );
}
