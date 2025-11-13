import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./header";
import Navbar from "./navbar";
import Footer from "./footer";
import ScrollToTop from "../components/ScrollToTop";
import ChatCrabWidget from "../chat/ChatCrab";
import { useChatbot } from "../hooks/public/useChatbot";

export default function MainLayout() {
  const { sendMessage, botEnabled } = useChatbot();

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header + Navbar */}
      <Header />
      <Navbar />

      {/* Scroll to top al cambiar ruta */}
      <ScrollToTop />
      <ScrollRestoration getKey={(loc) => loc.pathname} />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat flotante Don Cangrejo - Solo se muestra si está habilitado */}
      {botEnabled && (
        <ChatCrabWidget
          title="Don Cangrejo — Chat"
          subtitle="Puedo ayudarte con reservas y mareas"
          accent="#0D784A"
          headerColor="#443314"
          position="bottom-right"
          offset={{ x: 20, y: 20 }}
          onSend={sendMessage}
        />
      )}
    </div>
  );
}