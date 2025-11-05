// src/pages/auth/LoginPage.tsx
import LoginForm from "../../components/admin/auth/LoginForm";
// ⬇️ importa la imagen local desde assets
import playa2 from "../../assets/playa2.jpg"; // <-- ajusta a .png/.jpeg si corresponde

const logoSrc = "https://i.ibb.co/b5ZY3Rb9/mudecoop.webp";
// ⬇️ usa la de assets (no la web ni /public)
const heroSrc = playa2;

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* IZQUIERDA: imagen a borde completo */}
      <div className="relative hidden md:block">
        <img
          src={heroSrc}
          alt="Vista de MUDECOOP"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-5 left-10 right-10 text-white drop-shadow">
          <h2 className="text-4xl font-semibold leading-tight">Navega tu plataforma</h2>
          <p className="opacity-90 mt-2 text-lg">
            Administra contenidos y módulos desde un único panel.
          </p>
        </div>
      </div>

      {/* DERECHA: tarjeta compacta */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-[#F8FAF8]">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-8">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={logoSrc}
              alt="MUDECOOP"
              className="h-12 w-12 rounded-full border border-black/10 object-cover"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0D784A]">MUDECOOP</h1>
              <p className="text-xs text-neutral-500">Panel Administrativo • Acceso</p>
            </div>
          </div>

          {/* Contenedor para alinear el botón de “ojo” sin tocar LoginForm */}
          <div className="relative [&_input[type='password']]:pr-10 [&_input[type='text']]:pr-10
                          [&_button[aria-label='toggle-password']]:absolute
                          [&_button[aria-label='toggle-password']]:right-3
                          [&_button[aria-label='toggle-password']]:top-1/2
                          [&_button[aria-label='toggle-password']]:-translate-y-1/2">
            <LoginForm />
          </div>

          <div className="mt-6 border-t pt-4 text-xs text-neutral-400 text-center">
            © {new Date().getFullYear()} MUDECOOP • v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
