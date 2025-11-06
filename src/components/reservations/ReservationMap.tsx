// ✅ src/components/reservations/ReservationMap.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { useReservation } from "../../hooks/public/useReservation";
import type { TableInfo, TableLocation } from "../../types/reservation";

const BLUE = "#50ABD7";
const SEATS_PER_TABLE = 6;

const titleByLocation: Record<TableLocation, string> = {
  interior: "Salón Principal",
  terraza: "Terraza",
  privada: "Sala Privada",
  bar: "Área de Bar",
};

const descByLocation: Record<TableLocation, string> = {
  interior: "Ambiente amplio y climatizado.",
  terraza: "Aire libre y vista al mar.",
  privada: "Privacidad total para grupos.",
  bar: "Zona dinámica cerca de la barra.",
};

const DEFAULT_LOCATION: TableLocation = "interior";

const ReservationMap: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } =
    useReservation();

  // ✅ Estado local, NO actualizar provider en cada render
  const [selectedTables, setSelectedTables] = useState<number[]>(
    reservationData.tableNumber ? [reservationData.tableNumber] : []
  );

  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const people = reservationData.peopleCount;
  const allowMulti = people > SEATS_PER_TABLE;
  const seatsSelected = selectedTables.length * SEATS_PER_TABLE;
  const coverageReached = allowMulti && seatsSelected >= people;

  // ✅ Mock de mesas
  useEffect(() => {
    const mock: TableInfo[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      seats: SEATS_PER_TABLE,
      available: Math.random() > 0.25,
      location: DEFAULT_LOCATION,
    }));

    setTimeout(() => {
      setTables(mock);
      setIsLoading(false);
    }, 300);
  }, []);

  const locations = useMemo<TableLocation[]>(() => {
    const set = new Set<TableLocation>();
    tables.forEach((t) => t.location && set.add(t.location));
    return Array.from(set);
  }, [tables]);

  // ✅ Selección local de mesas
  const handleSelect = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.available) return;

    setSelectedTables((prev) => {
      const exists = prev.includes(tableId);

      if (!allowMulti) return exists ? [] : [tableId];

      if (coverageReached && !exists) return prev;

      return exists
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId];
    });
  };

  // ✅ Actualizar provider SOLO al continuar
  const handleContinue = () => {
    updateReservationData({
      tableNumber: selectedTables[0] ?? null,
    });

    nextStep();
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin h-10 w-10 border-b-2 mx-auto" />
        <p className="text-muted mt-4">Cargando mesas...</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg border max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Selecciona tu Mesa</h2>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* RESUMEN */}
        <div className="lg:col-span-1 border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Tu Reserva</h3>

          <p className="text-sm text-muted flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {reservationData.date
              ? reservationData.date.toLocaleDateString("es-CR")
              : "—"}
          </p>

          <p className="text-sm text-muted flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {reservationData.time}
          </p>

          <p className="text-sm text-muted flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {people} personas
          </p>

          {allowMulti && (
            <p className="text-xs mt-2 text-muted">
              Capacidad seleccionada: {seatsSelected}/{people}
            </p>
          )}
        </div>

        {/* MAPA */}
        <div className="lg:col-span-3 space-y-6">
          {locations.map((loc) => {
            const byLoc = tables.filter((t) => t.location === loc);
            if (!byLoc.length) return null;

            return (
              <section key={loc} className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {titleByLocation[loc]}
                </h3>

                <p className="text-sm text-muted mb-4">
                  {descByLocation[loc]}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {byLoc.map((table) => {
                    const selected = selectedTables.includes(table.id);
                    const disabled =
                      !table.available ||
                      (!selected && allowMulti && coverageReached);

                    return (
                      <button
                        key={table.id}
                        disabled={disabled}
                        onClick={() => handleSelect(table.id)}
                        className={`p-4 border rounded-lg ${
                          selected
                            ? "bg-blue-500 text-white"
                            : disabled
                            ? "opacity-50"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">Mesa #{table.id}</div>

                        <div className="text-sm flex items-center justify-center mt-1">
                          <Users className="w-3 h-3 mr-1" />
                          {table.seats}
                        </div>

                        {selected && (
                          <CheckCircle className="w-4 h-4 mx-auto mt-2" />
                        )}

                        {!table.available && !selected && (
                          <XCircle className="w-4 h-4 mx-auto mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <div className="flex gap-4">
            <button
              onClick={prevStep}
              className="flex-1 py-3 border rounded-lg"
            >
              Volver
            </button>

            <button
              onClick={handleContinue}
              disabled={selectedTables.length === 0}
              className="flex-1 py-3 rounded-lg text-white shadow-md"
              style={{
                backgroundColor: selectedTables.length > 0 ? BLUE : "gray",
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationMap;
