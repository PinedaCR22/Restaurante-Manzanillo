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
    includes: [
      "Rampa de cemento en uso; punto de embarque y desembarque no oficial.",
      "Acceso más seguro y directo que playas vecinas para abordar pangas.",
      "Flora y fauna frecuente como pelícanos, garzas/espátulas rosadas, monos, congo, pizotes, cocodrilos y mantarrayas; avistamientos ocasionales de delfines/ballenas."
    ],
    schedules: [
      { day: "Visita recomendada", hours: "06:00–18:00 (luz día)" },
      { day: "Operación de pangas", hours: "sujeta a marea; verificar tabla de mareas del día" }
    ],
    contacts: [
      { label: "Contacto y reservas", value: "Según entrevistas con lideres locales; coordinar en el mismo sitio o con referentes comunitarios." }
    ],
    gallery: [fallbackCover("malecon"), fallbackCover("malecon")],
  },

    // ========= MANZANILLO CENTRO =========
  "manzanillo-centro": {
    id: "manzanillo-centro",
    title: "MANZANILLO CENTRO",
    cover: fallbackCover("manzanillo-centro"),
    description:
      "Comunidad costera de 1.000 habitantes (300 familias). La pesca artesanal es la actividad principal; parte de la población trabaja en fincas cercanas o se desplaza a otras localidades. Cuenta con servicios básicos (escuela, colegio, CEN, EBAIS, salón comunal, iglesia, plaza deportiva y redondel), aunque algunos operan de forma intermitente.",
    includes: [
      "EBAIS para Manzanillo/Don Garito cada 15 días (atención limitada; emergencias suelen trasladarse a clínicas de Chómez o Colorado).",
      "Traslados también por panga hacia zonas como Nicoya, dependientes de la marea."
    ],
    schedules: [
      { day: "Buses (Lun–Sáb)", hours: "05:30, 06:40, 08:30, 11:30, 13:30 y 15:30 (último)" },
      { day: "Domingos", hours: "Servicio reducido; confirmar en terminal de Chómez/Colorado" }
    ],
    contacts: [
      { label: "Contacto y reservas", value: "Información basada en entrevistas comunitarias; coordinar con comité local o lideres de MUDECOOP en el salón comunal." }
    ],
    gallery: [fallbackCover("manzanillo-centro")],
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
