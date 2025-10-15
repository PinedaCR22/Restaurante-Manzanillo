// src/chat/ChatCrab.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DonCangrejo } from "./DonCangrejo";
import { botReply, getFaqs, type FaqItem } from "../services/chatbot/chatbot";

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
  initialMessages?: ChatCrabMessage[];
  botMood?: "happy" | "helpful" | "thinking" | "celebrate" | "warning" | "sleep";
};

/* ========= Utils ========= */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[¡!¿?.,;:()[\]'"«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* ========= Hook: FAQs del backend ========= */
function useFaqData() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getFaqs()
      .then((data: FaqItem[]) => {
        if (!alive) return;
        setFaqs(data);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { faqs, loading };
}

/* ========= Temas fijos (chips) ========= */
const PRIORITY_TOPICS = ["reservas", "horarios", "menu", "marea", "contacto", "eventos"] as const;
type PriorityTopic = typeof PRIORITY_TOPICS[number];

/* ========= Botón flotante ========= */
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
      className={`group rounded-full shadow-lg border border-[color-mix(in srgb, var(--fg) 20%, transparent)]
                  bg-[var(--card)] backdrop-blur p-3 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div
        className="relative grid place-items-center rounded-full size-12 md:size-14 overflow-hidden
                   border border-[color-mix(in srgb, var(--fg) 25%, transparent)]"
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
  sending: boolean;
  botMood?: ChatCrabProps["botMood"];
}> = ({
  open,
  onClose,
  title,
  subtitle,
  headerColor,
  messages,
  onSend,
  sending,
  botMood = "helpful",
}) => {
  const { faqs, loading } = useFaqData();

  // Frases estrictas: solo las "q" del backend
  const phrases = useMemo(() => faqs.map((f) => f.q).filter(Boolean), [faqs]);

  // Mapeo de chip -> pregunta canónica (se elige la primera FAQ cuyo tag o id matchee el tema)
  const topicToQuestion = useMemo<Record<PriorityTopic, string | undefined>>(() => {
    const map = {} as Record<PriorityTopic, string | undefined>;
    const normId = (s: string) => norm(s).replace(/^faq-/, "");
    for (const topic of PRIORITY_TOPICS) {
      const faq =
        faqs.find((f) => (f.tags ?? []).map(norm).includes(topic)) ||
        faqs.find((f) => normId(f.id).includes(topic) || norm(f.q).includes(topic));
      map[topic] = faq?.q;
    }
    return map;
  }, [faqs]);

  const [text, setText] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showSuggest, setShowSuggest] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  /* Enfoque/escape panel */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSuggest) { setShowSuggest(false); return; }
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, showSuggest]);

  /* Auto scroll */
  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  /* Cerrar sugerencias al click fuera del composer */
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!composerRef.current) return;
      if (!composerRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  /* Sugerencias (filtra solo por prefix/contains sobre preguntas canónicas) */
  const suggestions = useMemo(() => {
    const q = norm(text);
    if (!q) return [];
    const starts = phrases.filter((p) => norm(p).startsWith(q));
    const contains = phrases.filter((p) => !norm(p).startsWith(q) && norm(p).includes(q));
    const list = [...starts, ...contains].slice(0, 6);
    setShowSuggest(list.length > 0); // mostrar si hay
    return list;
  }, [text, phrases]);

  useEffect(() => setActiveIdx(-1), [suggestions.length]);

  const acceptSuggestion = (value?: string) => {
    const val = value ?? suggestions[activeIdx];
    if (!val) return;
    setText(val);
    setShowSuggest(false);
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(val.length, val.length));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggest && suggestions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i + 1) % suggestions.length); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => (i - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === "Tab")       { e.preventDefault(); acceptSuggestion(); return; }
      if (e.key === "Escape")    { e.preventDefault(); setShowSuggest(false); return; }
    }
    // Enter envía (Shift+Enter = nueva línea)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      onSend(trimmed);
      setText("");
      setShowSuggest(false);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setText("");
    setShowSuggest(false);
  };

  /* Click de chip: usa la pregunta canónica mapeada */
  const onChip = (topic: PriorityTopic) => {
    const q = topicToQuestion[topic];
    if (q) setText(q);
    else setText(topic); // fallback mínimo si no hubiera match
    setShowSuggest(false);
    inputRef.current?.focus();
  };

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        role="button"
        aria-label="Cerrar chat"
        onClick={() => { if (showSuggest) setShowSuggest(false); else onClose(); }}
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
        <div className="rounded-t-2xl px-4 py-3 flex items-center gap-3 text-white" style={{ background: headerColor }}>
          <div className="shrink-0 grid place-items-center rounded-full bg-white/15 p-1">
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
        <div ref={listRef} className="flex-1 overflow-auto px-3 py-4 space-y-3 text-[var(--fg)]">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-muted px-6">
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
                  ${
                    m.role === "user"
                      ? "bg-[var(--accent-50)] border-[var(--accent-200)]"
                      : "bg-[var(--card)] border-neutral-300 dark:border-neutral-600"
                  }`}
                  style={
                    m.role === "user"
                      ? { ["--accent-50" as any]: `${"#0D784A"}1A`, ["--accent-200" as any]: `${"#0D784A"}66` }
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
        <div ref={composerRef} className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-[var(--bg)]">
          {/* Chips FIXED + hover muy claro */}
          {!loading && (
            <div className="mb-2 flex flex-wrap gap-2">
              {PRIORITY_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => onChip(t)}
                  className="text-xs px-2 py-1 rounded-full border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600/40"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                placeholder={sending ? "Don Cangrejo está respondiendo…" : "Escribe tu mensaje…"}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={sending}
                className="flex-1 resize-none rounded-xl border border-neutral-300 dark:border-neutral-600 bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-60"
                style={{ ["--accent" as any]: "#0D784A" }}
                onFocus={() => setShowSuggest(true)}
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="relative z-20 shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 disabled:opacity-60"
                style={{ background: "#0D784A" }}
              >
                Enviar
              </button>
            </div>

            {/* Dropdown de sugerencias: ARRIBA del input + click fuera para cerrar */}
            {showSuggest && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 sm:right-20 bottom-full mb-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-[var(--card)] shadow-lg overflow-auto z-[99] max-h-56"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={s + i}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); acceptSuggestion(s); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-600/50 ${
                      i === activeIdx ? "bg-neutral-200 dark:bg-neutral-600" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted mt-1">
            <span className="font-medium">Enter</span> para enviar — <span className="font-medium">Shift+Enter</span> para nueva línea — <span className="font-medium">Tab</span> para autocompletar
          </p>
        </div>
      </div>
    </div>
  );
};

/* ========= Mensajes iniciales ========= */
const defaultDemo: ChatCrabMessage[] = [
  { id: "1", role: "assistant", text: "¡Pura vida! ¿Reservamos o quieres ver horarios?" },
];

/* ========= Widget principal ========= */
const ChatCrabWidget: React.FC<ChatCrabProps> = ({
  title = "Don Cangrejo — Chat",
  subtitle = "Puedo ayudarte con reservas y mareas",
  accent = "#0D784A",
  headerColor = "#443314",
  position = "bottom-right",
  offset = { x: 20, y: 20 },
  initialOpen = false,
  initialMessages = defaultDemo,
  botMood,
}) => {
  const [open, setOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatCrabMessage[]>(initialMessages);
  const [unread, setUnread] = useState(false);
  const [mood, setMood] = useState<NonNullable<ChatCrabProps["botMood"]>>(botMood ?? "helpful");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open && messages.at(-1)?.role === "assistant") setUnread(true);
  }, [messages, open]);

  const send = async (text: string) => {
    if (sending) return;
    const userMsg: ChatCrabMessage = { id: crypto.randomUUID(), role: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setMood("thinking");
    setSending(true);

    const typingId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: typingId, role: "assistant", text: "…", ts: Date.now() }]);

    try {
      const server = await botReply(text, "es-cr");
      setMessages((prev) => prev.map((m) => (m.id === typingId ? { ...m, text: server.reply } : m)));
      setMood(server.type === "answer" ? "helpful" : "warning");
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? { ...m, text: "No pude procesar tu mensaje en este momento. Intenta de nuevo." }
            : m
        )
      );
      setMood("warning");
    } finally {
      setSending(false);
    }
  };

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
        sending={sending}
        botMood={mood}
      />
    </>
  );
};

export default ChatCrabWidget;
