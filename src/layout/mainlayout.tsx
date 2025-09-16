import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./header";
import Navbar from "./navbar";
import Footer from "./footer";
import ScrollToTop from "../components/ScrollToTop"; // 👈 importa el componente
import ChatCrabWidget from "../chat/ChatCrab";

export default function MainLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header + Navbar sólo para el área informativa */}
      <Header />
      <Navbar />

      {/* 👇 Aquí se asegura que siempre suba al top al cambiar ruta */}
      <ScrollToTop />
      <ScrollRestoration getKey={(loc) => loc.pathname} />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer igual en todo el sistema */}
      <Footer />
       {/* Chat flotante Don Cangrejo */}
      <ChatCrabWidget
        title="Don Cangrejo — Chat"
        subtitle="Puedo ayudarte con reservas y mareas"
        accent="#0D784A"
        headerColor="#443314"
        position="bottom-right"
        offset={{ x: 20, y: 20 }}
      />
    </div>
  );
}
