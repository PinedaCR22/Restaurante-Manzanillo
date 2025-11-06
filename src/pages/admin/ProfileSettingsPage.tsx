import { useEffect, useState } from "react";
import { Mail, UserCircle2, Lock } from "lucide-react";
import Button from "../../components/ui/Button";
import { useUserForm } from "../../hooks/users/useUserForm";
import { usersService } from "../../services/users/users.service";
import type { User } from "../../types/users/user";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { submitting, update, updatePassword } = useUserForm(() => loadUser());

  async function loadUser() {
    try {
      setLoading(true);
      const me = await usersService.getMe();
      setUser(me);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Cargando perfil...
      </div>
    );
  }

  if (!user) return <p className="text-center text-gray-600">No se pudo cargar el perfil.</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="relative w-24 h-24 rounded-full bg-[#E6F4EE] flex items-center justify-center mb-3 shadow-sm">
          <UserCircle2 size={64} color="#0D784A" />
        </div>
        <h1 className="text-3xl font-bold text-[#0D784A]">
          Configuración de Perfil
        </h1>
        <p className="text-gray-600 mt-1">
          Actualiza tu información personal y credenciales de acceso.
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-8 space-y-10">
        {/* Sección 1: Información Personal */}
        <section>
          <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
            Información Personal
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await update(user.id, {
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                secondLastName: user.secondLastName ?? "",
                email: user.email,
              });
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={user.firstName ?? ""}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Apellido
              </label>
              <input
                type="text"
                value={user.lastName ?? ""}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Apellido
              </label>
              <input
                type="text"
                value={user.secondLastName ?? ""}
                onChange={(e) =>
                  setUser({ ...user, secondLastName: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-[#0D784A] focus:border-[#0D784A]"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </section>

        {/* Sección 2: Seguridad */}
        <section>
          <h2 className="text-xl font-semibold text-[#0D784A] mb-4">
            Seguridad
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Lock className="text-[#0D784A]" />
              <span>Cambiar contraseña de acceso</span>
            </div>
            <Button
              variant="secondary"
              disabled={submitting}
              onClick={async () => {
                const password = prompt("Ingrese la nueva contraseña:");
                if (password) await updatePassword(user.id, password);
              }}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
