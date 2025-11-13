import React, { useEffect, useMemo, useRef, useState } from "react";
import { DonCangrejo } from "./DonCangrejo";
import { BotPublicService } from "../services/public/bot-public.service";

/* ========= Tipos ========= */
export type ChatCrabMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts?: number;
};

export type ChatCrabProps = {
  title?: string;
  subtitle?: string;
  accent?: string;
  headerColor?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  offset?: { x?: number; y?: number };
  initialOpen?: boolean;
  botMood?: "happy" | "helpful" | "thinking" | "celebrate" | "warning" | "sleep";
  onSend?: (text: string) => Promise<ChatCrabMessage>;
};

/* ========= Botón flotante (launcher) ========= */
const Launcher: React.FC<{
  onClick: () => void;
  position: NonNullable<ChatCrabProps["position"]>;
  offset?: ChatCrabProps["offset"];
  accent: string;
  unread?: boolean;
  open?: boolean;
}> = ({ onClick, position, offset, accent, unread, open }) => {
  const { x = 20, y = 20 } = offset ?? {};

  const corner = useMemo(() => {
    const style: React.CSSProperties = { position: "fixed", zIndex: 60 };
    if (position.includes("bottom")) style.bottom = y;
    if (position.includes("top")) style.top = y;
    if (position.includes("right")) style.right = x;
    if (position.includes("left")) style.left = x;
    return style;
  }, [position, x, y]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir chat Don Cangrejo"
      style={corner}
      className={`group rounded-full shadow-lg border border-[color-mix(in_srgb,_var(--fg)_20%,_transparent)]
                  bg-[var(--card)] backdrop-blur p-3 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className="relative grid place-items-center rounded-full size-12 md:size-14 overflow-hidden
                   border border-[color-mix(in_srgb,_var(--fg)_25%,_transparent)]"
        style={{ background: "var(--card)" }}
      >
        <DonCangrejo mood="happy" size={40} className="animate-crab-bob" />

        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition"
          style={{ boxShadow: `0 0 0 6px ${accent}1A inset` }}
        />

        {unread && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white shadow">
            1
          </span>
        )}
      </div>
    </button>
  );
};

/* ========= Panel del chat ========= */
const ChatPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accent: string;
  headerColor: string;
  messages: ChatCrabMessage[];
  onSend: (text: string) => void;
  onClear?: () => void;
  botMood?: ChatCrabProps["botMood"];
  isLoading?: boolean;
}> = ({
  open,
  onClose,
  title,
  subtitle,
  accent,
  headerColor,
  messages,
  onSend,
  onClear,
  botMood = "helpful",
  isLoading = false,
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* Accesibilidad: ESC y focus trap */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          lastEl?.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          firstEl?.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Auto scroll */
  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        role="button"
        aria-label="Cerrar chat"
        onClick={onClose}
        className={`absolute inset-0 transition ${open ? "bg-black/20" : "bg-transparent"}`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute w-full sm:w-[26rem] md:w-[28rem] h-[85svh] sm:h-[34rem]
                    bg-[var(--card)] flex flex-col transition-all duration-300 ease-out
                    bottom-0 right-0 sm:bottom-6 sm:right-6
                    ${open
                      ? "translate-y-0 opacity-100 rounded-t-2xl sm:rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700"
                      : "translate-y-full opacity-0 pointer-events-none rounded-t-2xl sm:rounded-2xl shadow-none border-0"}`}
        style={{ zIndex: 70 }}
      >
        {/* Header */}
        <div
          className="rounded-t-2xl px-4 py-3 flex items-center gap-3 text-white"
          style={{ background: headerColor }}
        >
          <div className="shrink-0 grid place-items-center rounded-full bg-white/15 p-1">
            <DonCangrejo mood={botMood} size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">{title}</h3>
            {subtitle && <p className="text-xs/5 opacity-90 truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1">
            {/* Botón limpiar chat */}
            {onClear && messages.length > 0 && (
              <button
                onClick={onClear}
                className="rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Limpiar conversación"
                title="Limpiar conversación"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            )}
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div
          ref={listRef}
          className="flex-1 overflow-auto px-3 py-4 space-y-3 text-[var(--fg)]"
        >
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-muted px-6">
              <div>
                <DonCangrejo size={40} className="mx-auto mb-2" />
                <p className="text-sm">
                  ¡Hola! Soy <span className="font-semibold">Don Cangrejo</span>.  
                  Te ayudo con reservas, mareas y dudas del restaurante flotante.
                </p>
                <p className="text-xs mt-1">Escribe tu pregunta abajo para comenzar.</p>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm border
                  ${
                    m.role === "user"
                      ? "bg-[var(--accent-50)] border-[var(--accent-200)]"
                      : "bg-[var(--card)] border-neutral-300 dark:border-neutral-600"
                  }`}
                  style={
                    m.role === "user"
                      ? ({
                          "--accent-50": accent + "1A",
                          "--accent-200": accent + "66",
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
          
          {/* Indicador de escritura */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm border bg-[var(--card)] border-neutral-300 dark:border-neutral-600">
                <div className="flex gap-1 items-center">
                  <span className="inline-block w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="inline-block w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="inline-block w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-[var(--bg)]">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu mensaje…"
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSend();
              }}
              className="flex-1 resize-none rounded-xl border border-neutral-300 dark:border-neutral-600 bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ "--accent": accent } as React.CSSProperties}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !text.trim()}
              className="relative z-20 shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: accent }}
            >
              Enviar
            </button>
          </div>
          <p className="text-[11px] text-muted mt-1">Ctrl/⌘ + Enter para enviar</p>
        </div>
      </div>
    </div>
  );
};

/* ========= Widget principal ========= */
const ChatCrabWidget: React.FC<ChatCrabProps> = ({
  title = "Don Cangrejo — Chat",
  subtitle = "Puedo ayudarte con reservas y mareas",
  accent = "#0D784A",
  headerColor = "#443314",
  position = "bottom-right",
  offset = { x: 20, y: 20 },
  initialOpen = false,
  botMood,
  onSend,
}) => {
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatCrabMessage[]>([]);
  const [unread, setUnread] = useState(false);
  const [mood, setMood] = useState<NonNullable<ChatCrabProps["botMood"]>>(botMood ?? "helpful");
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [botReady, setBotReady] = useState(false);
  const [initialMessagesCache, setInitialMessagesCache] = useState<ChatCrabMessage[]>([]);

  // 🔄 Cargar mensajes iniciales y verificar salud del bot
  useEffect(() => {
    (async () => {
      try {
        console.log("🔄 [ChatCrab] Inicializando...");
        
        // Verificar salud del bot primero
        const health = await BotPublicService.checkHealth();
        console.log("🩺 [ChatCrab] Health check:", health);
        
        if (!health.ok) {
          console.log("🚫 [ChatCrab] Bot deshabilitado");
          setBotReady(false);
          return;
        }
        
        setBotReady(true);
        
        // Cargar mensajes iniciales
        const initialMsgs = await BotPublicService.getInitialMessages();
        
        if (initialMsgs.length > 0) {
          const formatted: ChatCrabMessage[] = initialMsgs.map((msg) => ({
            id: crypto.randomUUID(),
            role: "assistant" as const,
            text: msg.content,
            ts: Date.now(),
          }));
          
          setMessages(formatted);
          setInitialMessagesCache(formatted); // 💾 Guardar para reset
          console.log("✅ [ChatCrab] Mensajes iniciales cargados:", formatted.length);
        } else {
          // Mensaje de bienvenida por defecto
          const defaultMsg = [{
            id: crypto.randomUUID(),
            role: "assistant" as const,
            text: "¡Pura vida! 🦀 Soy Don Cangrejo, tu anfitrión del restaurante flotante. ¿En qué puedo ayudarte hoy?",
            ts: Date.now(),
          }];
          setMessages(defaultMsg);
          setInitialMessagesCache(defaultMsg); // 💾 Guardar para reset
        }
      } catch (error) {
        console.error("❌ [ChatCrab] Error inicializando:", error);
        setBotReady(false);
      } finally {
        setIsLoadingInitial(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!open && messages.at(-1)?.role === "assistant") setUnread(true);
  }, [messages, open]);

  // 🗑️ Función para limpiar el chat
  const handleClear = () => {
    if (window.confirm("¿Estás seguro de que quieres limpiar la conversación?")) {
      setMessages(initialMessagesCache);
      setMood("helpful");
      console.log("🗑️ [ChatCrab] Chat limpiado");
    }
  };

  const send = async (text: string) => {
    const userMsg: ChatCrabMessage = { 
      id: crypto.randomUUID(), 
      role: "user", 
      text, 
      ts: Date.now() 
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setMood("thinking");

    try {
      if (onSend) {
        // Usar el callback proporcionado (del hook useChatbot)
        const reply = await onSend(text);
        setMessages((prev) => [...prev, reply]);
        setMood("helpful");
      } else {
        // Fallback si no hay onSend
        const reply = await BotPublicService.sendMessage(text);
        const assistantMsg: ChatCrabMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: reply.reply,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setMood("helpful");
      }
    } catch (error) {
      console.error("❌ [ChatCrab] Error enviando mensaje:", error);
      setMood("warning");
      
      const errorMsg: ChatCrabMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "¡Ups! 🦀 Hubo un problema. Intenta de nuevo en un momento.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // No mostrar el widget si está cargando o el bot no está listo
  if (isLoadingInitial || !botReady) {
    return null;
  }

  return (
    <>
      <Launcher
        onClick={() => {
          setOpen(true);
          setUnread(false);
        }}
        position={position!}
        offset={offset}
        accent={accent}
        unread={unread}
        open={open}
      />

      <ChatPanel
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        accent={accent}
        headerColor={headerColor}
        messages={messages}
        onSend={send}
        onClear={handleClear}
        botMood={mood}
        isLoading={false}
      />
    </>
  );
};

export default ChatCrabWidget;