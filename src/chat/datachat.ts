/**
 * Este archivo ya no es necesario porque los mensajes vienen del backend.
 * Se mantiene solo como referencia o fallback local en desarrollo.
 */

export const quickReplies = [
  { id: "qr1", text: "Reservar mesa" },
  { id: "qr2", text: "Horarios de hoy" },
  { id: "qr3", text: "Ubicación y parqueo" },
  { id: "qr4", text: "Menú y precios" },
];

export const greeting =
  "¡Hola! Soy Don Cangrejo 🦀⚓ Tu anfitrión del restaurante flotante. ¿Te ayudo a reservar?";

// Los mensajes iniciales ahora vienen de /bot/messages/initial
// Las respuestas vienen de /bot/reply con el matching de FAQs