// src/data/datachat.ts
import Fuse from "fuse.js";
import keyword_extractor from "keyword-extractor";

/** ====== Tipos ====== */
export type Faq = {
  q: string;
  a: string;
  tags?: string[];
  domain: "restaurante" | "mudecoop";
};

export type BotLocalReply =
  | { type: "answer"; text: string; faq?: Faq }
  | { type: "fallback"; text: string };

/** ====== Dataset (puedes editar libremente) ====== */
export const faqs: Faq[] = [
  {
    q: "¿Cómo hago una reserva?",
    a: "Puedes reservar por este chat indicando día, hora y cantidad de personas. También por WhatsApp al +506 8888-0000.",
    tags: ["reserva", "booking", "mesa", "apartar"],
    domain: "restaurante",
  },
  {
    q: "¿Cuáles son los horarios de atención?",
    a: "Abrimos de MARTES a DOMINGO, de 12:00 md a 10:00 pm. Lunes cerrado por mantenimiento.",
    tags: ["horario", "abren", "cierran", "apertura", "cierre"],
    domain: "restaurante",
  },
  {
    q: "¿Dónde están ubicados?",
    a: "Estamos en Manzanillo, Guanacaste. Punto de encuentro: muelle principal. Traslado en bote 3–5 minutos al restaurante flotante.",
    tags: ["ubicación", "dirección", "mapa", "cómo llegar", "muelle"],
    domain: "restaurante",
  },
  {
    q: "¿Tienen menú y precios?",
    a: "Sí. Menú con mariscos frescos, opciones vegetarianas y coctelería. Puedo enviarte el PDF o recomendar platos destacados.",
    tags: ["menú", "carta", "platos", "precios", "cocteles"],
    domain: "restaurante",
  },
  {
    q: "¿Cómo está la marea hoy?",
    a: "Puedo verificar mareas para tu hora de visita y recomendar el mejor horario de abordaje.",
    tags: ["marea", "oleaje", "clima", "mar"],
    domain: "restaurante",
  },
  {
    q: "¿Aceptan grupos o eventos?",
    a: "Sí. Indica fecha, horario y tamaño del grupo para cotizar.",
    tags: ["grupo", "eventos", "cumpleaños", "bodas", "corporativo"],
    domain: "restaurante",
  },
  {
    q: "¿Qué es MUDECOOP?",
    a: "MUDECOOP R.L. es la cooperativa que gestiona el proyecto del restaurante flotante y promueve el ecoturismo local en Manzanillo.",
    tags: ["mudecoop", "cooperativa", "proyecto", "gestión"],
    domain: "mudecoop",
  },
  {
    q: "¿Cómo apoyo a MUDECOOP?",
    a: "Puedes apoyar visitando el restaurante, participando en actividades y difundiendo el proyecto. Pregunta por voluntariado y donaciones.",
    tags: ["apoyo", "donación", "voluntariado", "colaborar"],
    domain: "mudecoop",
  },
];

/** ====== Utilidades ====== */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const allowedKeywords = new Set<string>([
  // restaurante
  "restaurante", "flotante", "reserva", "reservar", "mesa",
  "menu", "menú", "carta", "plato", "precios", "precio", "coctel", "cocteles",
  "horario", "abren", "cierran", "apertura", "cierre",
  "ubicacion", "ubicación", "direccion", "dirección", "mapa", "muelle",
  "marea", "oleaje", "mar", "clima", "abordaje", "bote", "lancha",
  "evento", "eventos", "grupo", "grupos",
  // mudecoop
  "mudecoop", "cooperativa", "proyecto", "apoyo", "donacion", "donación",
  "voluntariado", "turismo", "ecoturismo", "manzanillo",
  // ubicación general
  "guanacaste", "costa", "bahia", "bahía"
]);

function extractKeywords(text: string): string[] {
  const raw = keyword_extractor.extract(text, {
    language: "spanish",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
  return raw.map(norm);
}

function isOnDomain(text: string): boolean {
  const kws = extractKeywords(text);
  return kws.some((k) => allowedKeywords.has(k));
}

/** ====== Fuse (singleton) ====== */
let fuse: Fuse<Faq> | null = null;

function getFuse(): Fuse<Faq> {
  if (!fuse) {
    fuse = new Fuse(faqs, {
      includeScore: true,
      threshold: 0.38, // 0 = exacto, 1 = muy permisivo
      ignoreLocation: true,
      keys: [
        { name: "q", weight: 0.5 },
        { name: "tags", weight: 0.35 },
        { name: "a", weight: 0.15 },
      ],
    });
  }
  return fuse;
}

/** ====== API local ====== */
export async function replyFromFaqs(userText: string): Promise<BotLocalReply> {
  const text = (userText || "").slice(0, 500);

  // 1) filtro de dominio: solo restaurante/MUDECOOP
  if (!isOnDomain(text)) {
    return {
      type: "fallback",
      text: "Lo siento, no entendí. Puedo ayudarte con información del restaurante flotante o MUDECOOP.",
    };
  }

  // 2) búsqueda difusa
  const f = getFuse();
  const [best] = f.search(text, { limit: 1 }) as Array<{ item: Faq; score?: number }>;

  if (!best || best.score == null) {
    return {
      type: "fallback",
      text: "No encontré una respuesta exacta. ¿Podrías reformular tu pregunta?",
    };
  }

  // 3) umbral adicional de confianza
  if (best.score > 0.46) {
    return {
      type: "fallback",
      text: "No estoy seguro de haber entendido. Intenta preguntar sobre reservas, horarios, menú, ubicación o MUDECOOP.",
    };
  }

  return { type: "answer", text: best.item.a, faq: best.item };
}

/** (Opcional) respuestas rápidas para UI */
export const quickReplies = [
  { id: "qr1", text: "Reservar mesa" },
  { id: "qr2", text: "Horarios de hoy" },
  { id: "qr3", text: "Ubicación" },
  { id: "qr4", text: "Menú y precios" },
  { id: "qr5", text: "¿Qué es MUDECOOP?" },
];
