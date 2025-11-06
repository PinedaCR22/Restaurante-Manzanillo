// components/reservations/ReservationMap.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { useReservation } from "../../sections/homepage/reservationpage";
import type { TableInfo } from "../../types/reservation";

/** Brand color */
const BLUE = "#50ABD7";
const SEATS_PER_TABLE = 6;

/** Mapeo del label mostrado para la ubicación que SÍ es válida en tu tipo */
const LOCATION_KEY: TableInfo["location"] = "interior"; // <- clave válida del union

const titleByLocation: Record<string, string> = {
  interior: "Salón Principal",
};
const descByLocation: Record<string, string> = {
  interior: "Ambiente amplio, climatizado y cómodo para grupos.",
};

const ReservationMap: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } =
    useReservation();

  // Mantener compatibilidad con tableId: guardamos la primera seleccionada
  const [selectedTables, setSelectedTables] = useState<number[]>(
    reservationData.tableId ? [reservationData.tableId] : []
  );
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** Cargar 10 mesas, 6 asientos, todas en LOCATION_KEY (interior) */
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 300)); // simulación breve
      const mock: TableInfo[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        seats: SEATS_PER_TABLE,
        available: Math.random() > 0.2, // ~80% disponibles
        location: LOCATION_KEY,
      }));
      setTables(mock);
      setIsLoading(false);
    };
    fetchTables();
  }, []);

  /** Capacidad y reglas */
  const guests = reservationData.guests || 1;
  const allowMulti = guests > SEATS_PER_TABLE;
  const seatsSelected = selectedTables.length * SEATS_PER_TABLE;
  const coverageReached = allowMulti && seatsSelected >= guests;

  /** Única ubicación (interior) */
  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const t of tables) if (t.location) set.add(t.location);
    return Array.from(set);
  }, [tables]);

  /** Helpers UI */
  const selectedStyle = {
    backgroundColor: BLUE,
    borderColor: BLUE,
    color: "#fff",
  } as React.CSSProperties;

  const getTableClasses = (table: TableInfo, isSelected: boolean) => {
    if (isSelected)
      return "p-4 border-2 rounded-lg transition-all duration-200 text-center shadow-md outline-none";
    if (!table.available)
      return "p-4 border-2 rounded-lg transition-all duration-200 text-center cursor-not-allowed opacity-60 " +
        "bg-card border-[color:color-mix(in srgb,var(--fg) 16%,transparent)] text-muted";
    return "p-4 border-2 rounded-lg transition-all duration-200 text-center outline-none " +
      "bg-card text-app border-[color:color-mix(in srgb,var(--fg) 18%,transparent)] " +
      "hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)]";
  };

  /** Selección:
   *  - guests ≤ 6: solo 1 mesa
   *  - guests > 6: múltiples hasta cubrir (bloquear extras al cubrir)
   */
  const handleTableToggle = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.available) return;

    setSelectedTables((prev) => {
      const already = prev.includes(tableId);

      // Modo una sola mesa
      if (!allowMulti) {
        const next = already ? [] : [tableId];
        updateReservationData({ tableId: next[0] ?? null });
        return next;
      }

      // Modo múltiple
      const seatsBefore = prev.length * SEATS_PER_TABLE;

      // Si ya estamos cubiertos y no estamos quitando, bloquear
      if (coverageReached && !already) return prev;

      if (already) {
        const next = prev.filter((id) => id !== tableId);
        updateReservationData({ tableId: next[0] ?? null });
        return next;
      } else {
        if (seatsBefore < guests) {
          const next = [...prev, tableId];
          updateReservationData({ tableId: next[0] ?? null });
          return next;
        }
        return prev;
      }
    });
  };

  const handleContinue = () => {
    if (selectedTables.length > 0) nextStep();
  };

  const handleBack = () => {
    updateReservationData({ tableId: selectedTables[0] ?? null });
    prevStep();
  };

  if (isLoading) {
    return (
      <div className="bg-card text-app rounded-lg shadow-lg p-6 max-w-6xl mx-auto border border-[color:color-mix(in srgb,var(--fg) 12%,transparent)]">
        <div className="text-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: BLUE }}
          />
          <p className="text-muted">Cargando disponibilidad de mesas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-app rounded-lg shadow-lg p-6 max-w-6xl mx-auto border border-[color:color-mix(in srgb,var(--fg) 12%,transparent)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Selecciona tu Mesa</h2>
        <p className="text-muted">
          Elige en el Salón Principal la(s) mesa(s) para tu experiencia gastronómica
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar resumen (sin el cuadro del filtro) */}
        <div className="lg:col-span-1">
          <div className="rounded-lg p-4 sticky top-4 bg-card border border-[color:color-mix(in srgb,var(--fg) 12%,transparent)]">
            <h3 className="font-semibold mb-3">Tu Reserva</h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {reservationData.date
                    ? new Intl.DateTimeFormat("es-CR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(reservationData.date)
                    : "—"}
                </span>
              </div>
              <div className="flex items-center text-muted">
                <Clock className="w-4 h-4 mr-2" />
                <span>{reservationData.time || "—"}</span>
              </div>
              <div className="flex items-center text-muted">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {guests} {guests === 1 ? "persona" : "personas"}
                </span>
              </div>
            </div>

            {/* Leyenda (sin “Disponible”) */}
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Leyenda</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: BLUE }} />
                  <span>Seleccionada</span>
                </div>
                <div className="flex items-center">
                  <XCircle
                    className="w-4 h-4 mr-2"
                    style={{
                      color: "color-mix(in srgb, var(--fg) 35%, transparent)",
                    }}
                  />
                  <span>Ocupada</span>
                </div>
              </div>
            </div>

            {/* Estado de cobertura */}
            {allowMulti && (
              <p className="mt-4 text-xs text-muted">
                Capacidad seleccionada: {seatsSelected}/{guests} asientos
                {coverageReached ? " (requisitos cubiertos)" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Grid de mesas */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {locations.map((loc) => {
              const byLoc = tables.filter((t) => t.location === loc);
              if (byLoc.length === 0) return null;

              return (
                <section
                  key={loc}
                  className="border rounded-lg p-4 border-[color:color-mix(in srgb,var(--fg) 16%,transparent)]"
                >
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: BLUE }} />
                    <div>
                      <h3 className="font-semibold">
                        {titleByLocation[loc] || "Salón Principal"}
                      </h3>
                      <p className="text-sm text-muted">
                        {descByLocation[loc] || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {byLoc.map((table) => {
                      const isSelected = selectedTables.includes(table.id);
                      const classes = getTableClasses(table, isSelected);

                      // Bloquear sumar más si ya se cubrió (pero permitir des-seleccionar)
                      const disableForCoverage =
                        !isSelected && allowMulti && coverageReached;

                      const disabled = !table.available || disableForCoverage;

                      return (
                        <div key={table.id} className="relative">
                          <button
                            onClick={() => !disabled && handleTableToggle(table.id)}
                            disabled={disabled}
                            className={`${classes} ${
                              disabled && !isSelected
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            style={isSelected ? selectedStyle : undefined}
                            role="button"
                            aria-pressed={isSelected}
                            aria-disabled={disabled}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault();
                                handleTableToggle(table.id);
                              }
                            }}
                          >
                            <div className="font-medium">Mesa #{table.id}</div>
                            <div className="text-sm flex items-center justify-center mt-1">
                              <Users className="w-3 h-3 mr-1" />
                              {table.seats}
                            </div>

                            {isSelected && (
                              <CheckCircle
                                className="w-4 h-4 mx-auto mt-2"
                                aria-hidden
                                style={{ color: "#fff" }}
                              />
                            )}
                            {!table.available && !isSelected && (
                              <XCircle
                                className="w-4 h-4 mx-auto mt-2"
                                style={{
                                  color:
                                    "color-mix(in srgb, var(--fg) 35%, transparent)",
                                }}
                              />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-4 rounded-lg font-medium transition
                         border border-[color:color-mix(in srgb,var(--fg) 18%,transparent)]
                         text-app hover:bg-[color:color-mix(in srgb,var(--fg) 10%,transparent)]"
              type="button"
            >
              Volver
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedTables.length === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                selectedTables.length > 0
                  ? "text-white shadow-md hover:shadow-lg"
                  : "cursor-not-allowed opacity-70"
              }`}
              style={
                selectedTables.length > 0
                  ? { backgroundColor: BLUE }
                  : {
                      backgroundColor:
                        "color-mix(in srgb, var(--fg) 18%, transparent)",
                      color: "var(--fg)",
                    }
              }
              type="button"
            >
              {selectedTables.length > 0
                ? `Continuar con ${selectedTables.length} mesa${
                    selectedTables.length > 1 ? "s" : ""
                  }`
                : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationMap;
