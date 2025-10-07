import React, { useEffect, useMemo, useRef, useState } from "react";
import { DonCangrejo } from "./DonCangrejo";

// ========= Tipos =========
export type ChatCrabMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts?: number;
};

export type ChatCrabProps = {
  title?: string;
  subtitle?: string;
  accent?: string;        // color acento (botón, burbuja user)
  headerColor?: string;   // color del header
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  offset?: { x?: number; y?: number }; // opcional
  initialOpen?: boolean;
  initialMessages?: ChatCrabMessage[];
  onSend?: (text: string) => Promise<ChatCrabMessage | void> | ChatCrabMessage | void;
  botMood?: "happy" | "helpful" | "thinking" | "celebrate" | "warning" | "sleep";
};

// ========= Botón flotante (launcher) =========
const Launcher: React.FC<{
  onClick: () => void;
  position: NonNullable<ChatCrabProps["position"]>;
  offset?: ChatCrabProps["offset"]; // opcional
  accent: string;
  unread?: boolean;
  open?: boolean; // para ocultarlo cuando el chat está abierto
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
      className={`group rounded-full shadow-lg border border-neutral-200 bg-white/95 backdrop-blur p-3 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className="relative grid place-items-center rounded-full size-12 md:size-14 overflow-hidden"
        style={{ background: accent + "1A" }}  // 10% tint
      >
        {/* Mascota animada dentro del botón */}
        <DonCangrejo mood="happy" size={40} className="animate-crab-bob" />
        {unread && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white shadow">
            1
          </span>
        )}
      </div>
    </button>
  );
};

// ========= Panel del chat =========
const ChatPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  accent: string;
  headerColor: string;
  messages: ChatCrabMessage[];
  onSend: (text: string) => void;
  botMood?: ChatCrabProps["botMood"];
}> = ({
  open,
  onClose,
  title,
  subtitle,
  accent,
  headerColor,
  messages,
  onSend,
  botMood = "helpful",
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Accesibilidad: ESC, focus trap
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
          lastEl?.focus(); e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          firstEl?.focus(); e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto scroll al final
  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
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
                    bg-white flex flex-col transition-all duration-300 ease-out
                    bottom-0 right-0 sm:bottom-6 sm:right-6
                    ${open
                      ? "translate-y-0 opacity-100 rounded-t-2xl sm:rounded-2xl shadow-xl border border-neutral-200"
                      : "translate-y-full opacity-0 pointer-events-none rounded-t-2xl sm:rounded-2xl shadow-none border-0"}`}
        style={{ zIndex: 70 }}
      >
        {/* Header */}
        <div className="rounded-t-2xl px-4 py-3 flex items-center gap-3 text-white" style={{ background: headerColor }}>
          <div className="shrink-0 grid place-items-center rounded-full bg-white/15 p-1">
            {/* Mascota también en el header (sin bobbing para no distraer) */}
            <DonCangrejo mood={botMood} size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">{title}</h3>
            {subtitle && <p className="text-xs/5 opacity-90 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Mensajes */}
        <div ref={listRef} className="flex-1 overflow-auto px-3 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-neutral-500 px-6">
              <div>
                <DonCangrejo size={40} className="mx-auto mb-2" />
                <p className="text-sm">
                  ¡Hola! Soy <span className="font-semibold">Don Cangrejo</span>. Te ayudo con reservas, mareas y dudas del restaurante flotante.
                </p>
                <p className="text-xs mt-1">Escribe tu pregunta abajo para comenzar.</p>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm border
                  ${m.role === "user" ? "bg-[var(--accent-50)] border-[var(--accent-200)]" : "bg-white border-neutral-200"}`}
                  style={
                    m.role === "user"
                      ? { ["--accent-50" as any]: accent + "1A", ["--accent-200" as any]: accent + "66" }
                      : undefined
                  }
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu mensaje…"
              rows={1}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSend();
              }}
              className="flex-1 resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ ["--accent" as any]: accent }}
            />
            <button
              onClick={handleSend}
              className="relative z-20 shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2"
              style={{ background: accent }}
            >
              Enviar
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Ctrl/⌘ + Enter para enviar</p>
        </div>
      </div>
    </div>
  );
};

// ========= Demo por defecto =========
const defaultDemo: ChatCrabMessage[] = [
  { id: "1", role: "assistant", text: "¡Pura vida! ¿Reservamos o quieres ver horarios?" },
  { id: "2", role: "user", text: "Reserva para 4 mañana 7pm." },
  { id: "3", role: "assistant", text: "Con gusto. ¿Nombre y teléfono de contacto?" },
];

// ========= Widget principal =========
const ChatCrabWidget: React.FC<ChatCrabProps> = ({
  title = "Don Cangrejo (Chat)",
  subtitle = "En línea • Tiempo de espera ~1 min",
  accent = "#0D784A",
  headerColor = "#443314",
  position = "bottom-right",
  offset = { x: 20, y: 20 },
  initialOpen = false,
  initialMessages = defaultDemo,
  onSend,
  botMood,
}) => {
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatCrabMessage[]>(initialMessages);
  const [unread, setUnread] = useState(false);
  const [mood, setMood] = useState<NonNullable<ChatCrabProps["botMood"]>>(botMood ?? "helpful");

  useEffect(() => {
    if (!open && messages.at(-1)?.role === "assistant") setUnread(true);
  }, [messages, open]);

  const send = async (text: string) => {
    const userMsg: ChatCrabMessage = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setMood("thinking");

    try {
      const maybe = await onSend?.(text);
      if (maybe && typeof maybe === "object") {
        setMessages((prev) => [...prev, maybe]);
      } else if (!onSend) {
        const reply: ChatCrabMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Gracias. Enlazaremos disponibilidad real en breve.",
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, reply]);
      }
      setMood("helpful");
    } catch {
      const err: ChatCrabMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Ups, hubo un problema enviando tu mensaje. Intenta de nuevo.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, err]);
      setMood("warning");
    }
  };

  return (
    <>
      <Launcher
        onClick={() => { setOpen(true); setUnread(false); }}
        position={position!}
        offset={offset}
        accent={accent}
        unread={unread}
        open={open}   // => se oculta cuando el chat está abierto
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
        botMood={mood}
      />
    </>
  );
};

export default ChatCrabWidget;
