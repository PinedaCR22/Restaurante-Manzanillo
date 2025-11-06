import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  CalendarDays,
  MessageSquareText,
  Images,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Activity,
  RefreshCw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";

interface QuickAction {
  to: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { stats, loading, error, reload } = useDashboard();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  const quickActions: QuickAction[] = [
    {
      to: "/admin/menu",
      label: "Menú",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      description: "Gestionar platillos y categorías",
    },
    {
      to: "/admin/reservas",
      label: "Reservas",
      icon: <CalendarDays className="w-5 h-5" />,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      description: "Ver y administrar reservas",
    },
    {
      to: "/admin/galeria",
      label: "Galería",
      icon: <Images className="w-5 h-5" />,
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      description: "Administrar imágenes",
    },
    {
      to: "/admin/faqs-chatbot",
      label: "Centro de Ayuda",
      icon: <HelpCircle className="w-5 h-5" />,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      description: "FAQs y Chatbot",
    },
    {
      to: "/admin/contacto",
      label: "Contacto",
      icon: <MessageSquareText className="w-5 h-5" />,
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      description: "Mensajes de contacto",
    },
    {
      to: "/admin/actividades",
      label: "Actividades",
      icon: <Activity className="w-5 h-5" />,
      color: "text-teal-700",
      bgColor: "bg-teal-50",
      description: "Gestionar actividades",
    },
  ];

  if (error) {
    return (
      <div className="p-6 lg:p-10 min-h-screen bg-gradient-to-br from-[#F8FAF8] to-[#E6F4EE]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Error al cargar el dashboard
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={reload}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-gradient-to-br from-[#F8FAF8] to-[#E6F4EE] min-h-screen">
      {/* Header con saludo personalizado */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-[#0D784A]">
          {greeting}, {user?.firstName || "Administrador"}
        </h1>
        <p className="text-lg text-neutral-600">
          Aquí tienes un resumen de lo que está pasando en el restaurante
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 animate-pulse"
            >
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Platillos Activos */}
          <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#E6F4EE] text-emerald-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">
                Platillos Activos
              </p>
              <p className="text-3xl font-bold text-[#1E293B] mb-2">
                {stats.platillos.activos}
              </p>
              <p className="text-xs text-neutral-400">{stats.platillos.trend}</p>
            </div>
          </div>

          {/* Reservas Pendientes */}
          <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#E6F4EE] text-blue-600">
                <CalendarDays className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">
                Reservas Pendientes
              </p>
              <p className="text-3xl font-bold text-[#1E293B] mb-2">
                {stats.reservas.pendientes}
              </p>
              <p className="text-xs text-neutral-400">
                {stats.reservas.semana} esta semana
              </p>
            </div>
          </div>

          {/* Mensajes Nuevos */}
          <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#E6F4EE] text-rose-600">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">
                Mensajes Nuevos
              </p>
              <p className="text-3xl font-bold text-[#1E293B] mb-2">
                {stats.contacto.nuevos}
              </p>
              <p className="text-xs text-neutral-400">
                {stats.contacto.ultimas24h} últimas 24h
              </p>
            </div>
          </div>

          {/* Imágenes en Galería */}
          <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#E6F4EE] text-purple-600">
                <Images className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">
                Imágenes en Galería
              </p>
              <p className="text-3xl font-bold text-[#1E293B] mb-2">
                {stats.galeria.total}
              </p>
              <p className="text-xs text-neutral-400">
                +{stats.galeria.recientes} esta semana
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Accesos rápidos */}
      <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1E293B] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0D784A]" />
            Accesos Rápidos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.to}
              className="group relative overflow-hidden rounded-xl border-2 border-neutral-200 p-4 hover:border-[#0D784A] hover:shadow-md transition-all"
            >
              <div className="flex flex-col h-full">
                <div
                  className={`w-12 h-12 rounded-xl ${action.bgColor} ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#0D784A] transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs text-neutral-500 mb-3 flex-grow">
                  {action.description}
                </p>
                <div className="flex items-center text-[#0D784A] text-sm font-medium">
                  Ir
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
