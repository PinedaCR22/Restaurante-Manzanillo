// src/data/activityDetails.ts
import { ACTIVITIES } from "./dataactivities";

export type ActivitySchedule = { day: string; hours: string };

export type ActivityDetail = {
  id: string;
  title: string;
  cover?: string;
  description: string;
  includes: string[];
  schedules: ActivitySchedule[];       // se mostrará dentro de "¿Qué incluye y horarios?"
  contacts: Array<{ label: string; value: string; href?: string }>; // se mostrará en "Contacto y reservas"
  gallery?: string[];
};

// Util para reusar la misma imagen cuando aún no hay assets definitivos
const fallbackCover = (id: string) =>
  ACTIVITIES.find(a => a.id === id)?.image ??
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

export const ACTIVITY_DETAILS: Record<string, ActivityDetail> = {
  // ========= ASO. COYOLITO =========
  "aso-coyolito": {
    id: "aso-coyolito",
    title: "ASO. COYOLITO",
    cover: fallbackCover("aso-coyolito"),
    description:
      "Experiencia comunitaria en Coyolito con enfoque cultural y gastronómico. Recorrido guiado por puntos de interés, historia local y degustaciones artesanales de la zona.",
    includes: [
      "Guía local",
      "Degustación de platillos típicos",
      "Recorrido por puntos históricos",
    ],
    schedules: [
      { day: "Lunes a Viernes", hours: "9:00–12:00 / 14:00–17:00" },
      { day: "Sábados y Domingos", hours: "9:00–13:00" },
    ],
    contacts: [
      { label: "WhatsApp", value: "+506 7000-7000", href: "https://wa.me/50670007000" },
      { label: "Correo", value: "info@coyolito.org", href: "mailto:info@coyolito.org" },
    ],
    gallery: [fallbackCover("aso-coyolito"), fallbackCover("aso-coyolito")],
  },

  // ========= MALECÓN =========
  "malecon": {
    id: "malecon",
    title: "MALECÓN",
    cover: fallbackCover("malecon"),
    description:
      "El malecón de Manzanillo es un punto histórico y emblemático que funcionó durante décadas como puerto de carga y descarga de ganado, café, oro, granos y pasajeros. Su rampa y bodegas, como la conocida Casa Verde, eran clave para almacenar y embarcar productos cuando no existían carreteras establecidas. Antiguamente conocido como Puerto Iglesias, conectaba Manzanillo con Puntarenas y servía como centro de intercambio comercial y social de la región.",
    includes: ["Actualmente el malecón conserva su rampa de cemento y sigue siendo utilizado como puerto no oficial para el traslado de mercancías, ganado y pasajeros en pangas, especialmente los viernes cuando llegan grandes embarcaciones con insumos. A diferencia de otras comunidades vecinas, Manzanillo cuenta con infraestructura establecida que facilita el acceso directo desde buses y vehículos, reduciendo riesgos y tiempos para los viajeros. Además, el área es hábitat de una rica flora y fauna: pelícanos, garzas, espátulas rosadas, martín peña, monos congos, pizotes, cocodrilos, mantarrayas e incluso avistamientos ocasionales de delfines y ballenas."],
    schedules: [{ day: "Todos los días", hours: "6:00–18:00" }],
    contacts: [{ label: "Turismo local", value: "+506 6000-6000", href: "tel:+50660006000" }],
    gallery: [fallbackCover("malecon"), fallbackCover("malecon")],
  },

  // ========= JUEGOS TRADICIONALES =========
  "juegos-tradicionales": {
    id: "juegos-tradicionales",
    title: "JGS. TRADICIONALES",
    cover: fallbackCover("juegos-tradicionales"),
    description:
      "Tarde de juegos tradicionales para todas las edades: trompo, cuerda, carrera de sacos y más. Actividad ideal para grupos y familias.",
    includes: ["Materiales de juego", "Coordinación", "Hidratación"],
    schedules: [{ day: "Sábados", hours: "15:00–17:30" }],
    contacts: [{ label: "Coordinación", value: "juegos@manzanillo.cr", href: "mailto:juegos@manzanillo.cr" }],
    gallery: [fallbackCover("juegos-tradicionales")],
  },

  // ========= TOUR SENDEROS =========
  "tour-senderos": {
    id: "tour-senderos",
    title: "TOUR SENDEROS",
    cover: fallbackCover("tour-senderos"),
    description:
      "Recorrido por senderos naturales con miradores y observación de flora y fauna. Apto para nivel principiante e intermedio.",
    includes: ["Guía certificado", "Seguro básico", "Bastones de apoyo (opcional)"],
    schedules: [
      { day: "Diario", hours: "8:00–11:30" },
      { day: "Diario", hours: "14:30–17:30" },
    ],
    contacts: [{ label: "Reservas", value: "+506 7200-7200", href: "https://wa.me/50672007200" }],
    gallery: [fallbackCover("tour-senderos"), fallbackCover("tour-senderos")],
  },

  // ========= HOSPEDAJES =========
  "hospedajes": {
    id: "hospedajes",
    title: "HOSPEDAJES",
    cover: fallbackCover("hospedajes"),
    description:
      "Opciones de hospedaje aliadas, con estándares básicos para familias y ciclistas: parqueo, Wi-Fi y acompañamiento local.",
    includes: ["Habitaciones privadas", "Wi-Fi", "Parqueo"],
    schedules: [{ day: "Check-in", hours: "14:00–21:00" }],
    contacts: [{ label: "Reservas", value: "reservas@hospedajes.cr", href: "mailto:reservas@hospedajes.cr" }],
    gallery: [fallbackCover("hospedajes")],
  },

  // ========= TOURS EN BICI =========
  "tours-en-bici": {
    id: "tours-en-bici",
    title: "TOURS EN BICI",
    cover: fallbackCover("tours-en-bici"),
    description:
      "Rutas guiadas en bicicleta por caminos locales. Opciones para principiantes e intermedios con paradas escénicas.",
    includes: ["Bicicleta (opcional)", "Casco", "Guía"],
    schedules: [{ day: "Mié / Sáb / Dom", hours: "7:00–10:30" }],
    contacts: [{ label: "WhatsApp", value: "+506 7300-7300", href: "https://wa.me/50673007300" }],
    gallery: [fallbackCover("tours-en-bici"), fallbackCover("tours-en-bici")],
  },

  // ========= MANZANILLO CENTRO =========
  "manzanillo-centro": {
    id: "manzanillo-centro",
    title: "MANZANILLO CENTRO",
    cover: fallbackCover("manzanillo-centro"),
    description:
      "Manzanillo Centro es una comunidad costera con alrededor de mil habitantes distribuidos en unas 300 familias. La principal actividad económica es la pesca artesanal, aunque algunas personas trabajan en fincas cercanas o se desplazan a otras localidades para conseguir empleo. La zona carece de fábricas propias y depende de recursos limitados, lo que hace que muchas familias tengan que buscar oportunidades fuera del lugar.",
    includes: ["En el pueblo se pueden encontrar servicios básicos como escuelas, colegio, CEN, EVAIS, salón comunal, iglesia, plaza deportiva y redondel, aunque algunos funcionan de forma intermitente. El EVAIS atiende únicamente ciertos días (miércoles para Manzanillo y jueves para Don Garito cada 15 días), por lo que ante emergencias la comunidad suele acudir a clínicas en Chómez o Colorado. Además del transporte terrestre, se utilizan pangas para trasladarse a otras zonas como Nicoya."],
    schedules: [{ day: "Lunes a Domingo", hours: "9:00–12:00" }],
    contacts: [{ label: "Información", value: "centro@manzanillo.cr", href: "mailto:centro@manzanillo.cr" }],
    gallery: [fallbackCover("manzanillo-centro")],
  },

  // ========= PESCA ARTESANAL =========
  "pesca-artesanal": {
    id: "pesca-artesanal",
    title: "PESC. ARTESANAL",
    cover: fallbackCover("pesca-artesanal"),
    description:
      "Experiencia de pesca artesanal con pescadores locales: técnicas, seguridad y sostenibilidad en el mar.",
    includes: ["Chaleco salvavidas", "Hidratación", "Guía"],
    schedules: [{ day: "Mañanas", hours: "5:00–8:30" }],
    contacts: [{ label: "Capitanía", value: "+506 7100-7100", href: "tel:+50671007100" }],
    gallery: [fallbackCover("pesca-artesanal"), fallbackCover("pesca-artesanal")],
  },
};
