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
    "La Asociación de Mujeres Unidas de la Montaña de Coyolito fue fundada en el año 2000 y agrupa actualmente a 10 mujeres activas dedicadas al turismo rural comunitario. Su labor se centra en rescatar tradiciones locales mediante actividades culturales, gastronómicas y recreativas como el tour del pan, los juegos tradicionales y las comidas típicas de la región.",
  includes: [
    "Elaboración de pan en horno de barro",
    "Comidas criollas: tamal asado, tortillas palmeadas, picadillo de papaya, sopa de gallina criolla",
    "Hospedaje y espacios seguros para acampar",
  ],
  schedules: [
    { day: "Actividades", hours: "Según llegada de grupos o coordinación previa" },
  ],
  contacts: [
    { label: "Yenory Rodríguez Arias", value: "+506 8806-7943", href: "tel:+50688067943" },
    { label: "María Eugenia Campos Moraga", value: "+506 8814-3097", href: "tel:+50688143097" },
    { label: "Correo", value: "yrodriguezarias18@gmail.com", href: "mailto:yrodriguezarias18@gmail.com" },
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
      "Comunidad costera de 3.000 habitantes (300 familias). La pesca artesanal es la actividad principal; parte de la población trabaja en fincas cercanas o se desplaza a otras localidades. Cuenta con servicios básicos (escuela, colegio, CEN, EBAIS, salón comunal, iglesia, plaza deportiva y redondel), aunque algunos operan de forma intermitente.",
    includes: [
      "EBAIS para Manzanillo/Abangaritos cada 15 días (atención limitada; emergencias suelen trasladarse a clínicas de Chomes o Colorado).",
      "Traslados también por panga hacia zonas como Nicoya, dependientes de la marea."
    ],
    schedules: [
      { day: "Buses (Lun–Sáb)", hours: "05:30, 06:40, 08:30, 11:30, 13:30 y 15:30 (último)" },
      { day: "Domingos", hours: "Servicio reducido; confirmar en terminal de Chomes/Colorado" }
    ],
    contacts: [
      { label: "Contacto y reservas", value: "Información basada en entrevistas comunitarias; coordinar con comité local o lideres de MUDECOOP en el salón comunal." }
    ],
    gallery: [fallbackCover("manzanillo-centro")],
  },

  // ========= JUEGOS TRADICIONALES =========
"juegos-tradicionales": {
  id: "juegos-tradicionales",
  title: "Juegos TRADICIONALES",
  cover: fallbackCover("juegos-tradicionales"),
  description:
    "Actividad comunitaria enfocada en rescatar los juegos típicos de la zona, como el trompo, la cuerda, los zancos, la suiza y el toro mecánico. Está pensada para grupos, visitantes y familias, promoviendo la convivencia y el valor cultural de las tradiciones locales.",
  includes: [
    "Materiales de juego y acompañamiento local",
    "Coordinación de actividades para grupos y visitantes",
    "Paquetes temáticos como el 'tour del pan', con preparación y degustación artesanal",
  ],
  schedules: [
    { day: "Coordinación", hours: "Según disponibilidad o previa reserva con la Asociación de Coyolito" },
  ],
  contacts: [
    { label: "Yenory Rodríguez Arias", value: "+506 8806-7943", href: "tel:+50688067943" },
    { label: "María Eugenia Campos Moraga", value: "+506 8814-3097", href: "tel:+50688143097" },
    { label: "Correo", value: "yrodriguezarias18@gmail.com", href: "mailto:yrodriguezarias18@gmail.com" },
  ],
  gallery: [fallbackCover("juegos-tradicionales")],
},

// ========= TOUR SENDEROS =========
"tour-senderos": {
  id: "tour-senderos",
  title: "TOUR SENDEROS",
  cover: fallbackCover("tour-senderos"),
  description:
    "Caminata guiada por los senderos naturales de la montaña de Coyolito, ubicada detrás del Salón Comunal de las Mujeres. El recorrido ofrece vistas panorámicas del Golfo de Nicoya y permite disfrutar de la flora y fauna local en un entorno tranquilo y seguro.",
  includes: [
    "Hidratación y refrigerio",
    "Charla interpretativa sobre árboles, aves y elementos históricos del lugar",
    "Recorrido guiado con vista panorámica al Golfo de Nicoya",
  ],
  schedules: [
    { day: "Temporada seca", hours: "Disponible con reserva previa (duración aproximada: 1 hora ida y vuelta)" },
    { day: "Temporada lluviosa", hours: "Suspendido por seguridad" },
  ],
  contacts: [
    { label: "Yenory Rodríguez Arias", value: "+506 8806-7943", href: "tel:+50688067943" },
    { label: "María Eugenia Campos Moraga", value: "+506 8814-3097", href: "tel:+50688143097" },
    { label: "Correo", value: "yrodriguezarias18@gmail.com", href: "mailto:yrodriguezarias18@gmail.com" },
  ],
  gallery: [fallbackCover("tour-senderos"), fallbackCover("tour-senderos")],
},

// ========= HOSPEDAJES =========
"hospedajes": {
  id: "hospedajes",
  title: "HOSPEDAJES",
  cover: fallbackCover("hospedajes"),
  description:
    "Servicio de hospedaje rural administrado por la Asociación de Mujeres de Coyolito. Cuenta con dos cabañas equipadas para cinco personas cada una, ubicadas dentro del proyecto comunitario en la montaña de Coyolito, a unos 15 km de Judas de Chomes.",
  includes: [
    "Baño privado con jabón, papel higiénico y toallas sanitarias",
    "Parqueo interno para dos vehículos",
    "Área cerrada y segura para acampar",
  ],
  schedules: [
    { day: "Check-in", hours: "Flexible; coordinar previamente con la Asociación de Coyolito" },
  ],
  contacts: [
    { label: "Yenory Rodríguez Arias", value: "+506 8806-7943", href: "tel:+50688067943" },
    { label: "María Eugenia Campos Moraga", value: "+506 8814-3097", href: "tel:+50688143097" },
    { label: "Correo", value: "yrodriguezarias18@gmail.com", href: "mailto:yrodriguezarias18@gmail.com" },
  ],
  gallery: [fallbackCover("hospedajes")],
},

// ========= TOURS EN BICI =========
"tours-en-bici": {
  id: "tours-en-bici",
  title: "TOURS EN BICI",
  cover: fallbackCover("tours-en-bici"),
  description:
    "Recorrido guiado en bicicleta por la comunidad de Coyolito, con paradas en dos puntos de interés donde se comparten reseñas y relatos sobre la historia local. La experiencia combina actividad física con contenido cultural, ideal para visitantes que desean conocer el entorno desde una perspectiva comunitaria.",
  includes: [
    "Uso de bicicleta e hidratación",
    "Charlas en puntos emblemáticos del pueblo sobre historia y tradiciones locales",
    "Coordinación con refrigerio, desayuno o almuerzo según disponibilidad",
  ],
  schedules: [
    { day: "Coordinación", hours: "Sin horario fijo; disponible por reserva previa" },
  ],
  contacts: [
    { label: "Yenory Rodríguez Arias", value: "+506 8806-7943", href: "tel:+50688067943" },
    { label: "María Eugenia Campos Moraga", value: "+506 8814-3097", href: "tel:+50688143097" },
    { label: "Correo", value: "yrodriguezarias18@gmail.com", href: "mailto:yrodriguezarias18@gmail.com" },
  ],
  gallery: [fallbackCover("tours-en-bici"), fallbackCover("tours-en-bici")],
},

// ========= PESCA ARTESANAL =========
"pesca-artesanal": {
  id: "pesca-artesanal",
  title: "PESC. ARTESANAL",
  cover: fallbackCover("pesca-artesanal"),
  description:
    "La pesca artesanal en el Golfo de Nicoya se realiza con pequeñas embarcaciones y técnicas tradicionales, enfocadas en la sostenibilidad y el uso responsable de los recursos marinos. Los pescadores locales practican este oficio diario en escalas reducidas, manteniendo vivas las costumbres del litoral.",
  includes: [
    "Explicación sobre técnicas tradicionales: trasmayo y pesca a mano",
    "Observación del trabajo de los pescadores locales en su entorno natural",
  ],
  schedules: [
    { day: "Recomendado", hours: "Mañanas, según condiciones del mar" },
  ],
  contacts: [
    { label: "Contacto y reservas", value: "Según entrevistas con líderes locales; coordinar en el mismo sitio o con referentes comunitarios." },
  ],
  gallery: [fallbackCover("pesca-artesanal"), fallbackCover("pesca-artesanal")],
},
};
