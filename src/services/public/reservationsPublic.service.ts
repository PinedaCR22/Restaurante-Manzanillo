// src/services/public/reservationsPublic.service.ts
import type {
  ApiTimeSlot,
  ApiTable,
  ReservationRequest,
  ReservationResponse,
} from "../../types/reservation";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE = `${API_BASE}/restaurant-reservations`;

export async function fetchAvailableHours(date: string): Promise<ApiTimeSlot[]> {
  const res = await fetch(`${BASE}/available-hours?date=${date}`);
  if (!res.ok) throw new Error(`Error al cargar horarios (${res.status})`);
  return res.json();
}

export async function fetchAvailableTables(params: {
  date: string;
  time: string;
  zone?: string;
}): Promise<ApiTable[]> {
  const query = new URLSearchParams({
    date: params.date,
    time: params.time,
    ...(params.zone ? { zone: params.zone } : {}),
  });

  const res = await fetch(`${BASE}/available-tables?${query.toString()}`);
  if (!res.ok) throw new Error(`Error al cargar mesas (${res.status})`);
  return res.json();
}

export async function createReservation(
  payload: ReservationRequest
): Promise<ReservationResponse> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok)
    throw new Error(
      `Error al crear la reserva (${res.status}): ${text}`
    );

  return JSON.parse(text);
}
