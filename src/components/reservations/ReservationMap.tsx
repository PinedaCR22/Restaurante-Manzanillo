// components/reservations/ReservationMap.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  CircleDot,
} from "lucide-react";
import { useReservation } from "../../sections/homepage/reservationpage";
import type { TableInfo } from "../../types/reservation";

/** Brand colors */
const BLUE = "#50ABD7";

/** Helper */
const titleByLocation: Record<string, string> = {
  terraza: "Terraza",
  interior: "Salón Interior",
  privada: "Área Privada",
  bar: "Zona Bar",
};

const descByLocation: Record<string, string> = {
  terraza: "Vista al jardín con ambiente relajado",
  interior: "Ambiente acogedor y climatizado",
  privada: "Perfecta para eventos especiales",
  bar: "Ambiente casual junto a la barra",
};

const ReservationMap: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } =
    useReservation();

  const [selectedTable, setSelectedTable] = useState<number | null>(
    reservationData.tableId
  );
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [filterByCapacity, setFilterByCapacity] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** Simulación de carga (reemplazar por endpoint real luego) */
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));

      const mock: TableInfo[] = [
        // Terraza
        { id: 1, seats: 2, available: true, location: "terraza" },
        { id: 2, seats: 2, available: false, location: "terraza" },
        { id: 3, seats: 4, available: true, location: "terraza" },
        { id: 4, seats: 4, available: true, location: "terraza" },
        { id: 5, seats: 6, available: false, location: "terraza" },
        // Interior
        { id: 6, seats: 2, available: true, location: "interior" },
        { id: 7, seats: 2, available: true, location: "interior" },
        { id: 8, seats: 4, available: false, location: "interior" },
        { id: 9, seats: 4, available: true, location: "interior" },
        { id: 10, seats: 6, available: true, location: "interior" },
        { id: 11, seats: 8, available: true, location: "interior" },
        // Privada
        { id: 12, seats: 6, available: true, location: "privada" },
        { id: 13, seats: 8, available: false, location: "privada" },
        { id: 14, seats: 10, available: true, location: "privada" },
        // Bar
        { id: 15, seats: 2, available: true, location: "bar" },
        { id: 16, seats: 2, available: true, location: "bar" },
        { id: 17, seats: 3, available: false, location: "bar" },
        { id: 18, seats: 4, available: true, location: "bar" },
      ];

      setTables(mock);
      setIsLoading(false);
    };

    fetchTables();
  }, []);

  /** Si cambian comensales, valida que la mesa seleccionada siga sirviendo */
  useEffect(() => {
    if (
      selectedTable != null &&
      tables.length > 0 &&
      reservationData.guests > 0
    ) {
      const t = tables.find((x) => x.id === selectedTable);
      if (!t || t.seats < reservationData.guests || !t.available) {
        setSelectedTable(null);
      }
    }
  }, [reservationData.guests, tables, selectedTable]);

  /** Filtrado por capacidad mínima requerida */
  const filteredTables = useMemo(() => {
    if (!filterByCapacity) return tables;
    const req = reservationData.guests;
    return tables.filter((t) => t.seats >= req);
  }, [tables, filterByCapacity, reservationData.guests]);

  /** Agrupación por ubicación dinámica */
  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const t of filteredTables) if (t.location) set.add(t.location);
    return Array.from(set);
  }, [filteredTables]);

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

  const handleTableSelect = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.available) return;
    setSelectedTable((prev) => (prev === tableId ? null : tableId));
  };

  const handleContinue = () => {
    if (selectedTable != null) {
      updateReservationData({ tableId: selectedTable });
      nextStep();
    }
  };

  const handleBack = () => {
    if (selectedTable != null) {
      updateReservationData({ tableId: selectedTable });
    }
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
          Elige la mesa perfecta para tu experiencia gastronómica
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar resumen */}
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
                  {reservationData.guests}{" "}
                  {reservationData.guests === 1 ? "persona" : "personas"}
                </span>
              </div>
            </div>

            {selectedTable != null && (
              <div
                className="mt-4 p-3 rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--fg) 10%, transparent)",
                }}
              >
                <h4 className="font-medium mb-1">Mesa Seleccionada</h4>
                <p className="text-sm" style={{ color: BLUE }}>
                  Mesa #{selectedTable} -{" "}
                  {tables.find((t) => t.id === selectedTable)?.seats} asientos
                </p>
                <p className="text-xs text-muted mt-1">
                  {
                    titleByLocation[
                      tables.find((t) => t.id === selectedTable)?.location || ""
                    ]
                  }
                </p>
              </div>
            )}

            {/* Filtro de capacidad */}
            <div className="mt-4 p-3 border rounded-lg border-[color:color-mix(in srgb,var(--fg) 16%,transparent)]">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterByCapacity}
                  onChange={(e) => setFilterByCapacity(e.target.checked)}
                  className="rounded border-[color:color-mix(in srgb,var(--fg) 30%,transparent)] focus:ring-2"
                  style={{ accentColor: BLUE }}
                />
                <span>Solo mostrar mesas adecuadas</span>
              </label>
              <p className="text-xs text-muted mt-1">
                Filtra por capacidad mínima requerida
              </p>
              <div className="mt-2 text-xs text-muted">
                {filteredTables.length} mesa
                {filteredTables.length === 1 ? "" : "s"} disponibles según tu
                selección
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Leyenda</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" style={{ color: BLUE }} />
                  <span>Seleccionada</span>
                </div>
                <div className="flex items-center">
                  <CircleDot className="w-4 h-4 mr-2" style={{ color: "#16a34a" }} />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 mr-2" style={{ color: "color-mix(in srgb, var(--fg) 35%, transparent)" as any }} />
                  <span>Ocupada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de mesas */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {locations.map((loc) => {
              const byLoc = filteredTables.filter((t) => t.location === loc);
              if (byLoc.length === 0) return null;

              return (
                <section key={loc} className="border rounded-lg p-4 border-[color:color-mix(in srgb,var(--fg) 16%,transparent)]">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: BLUE }} />
                    <div>
                      <h3 className="font-semibold">{titleByLocation[loc] || loc}</h3>
                      <p className="text-sm text-muted">
                        {descByLocation[loc] || ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {byLoc.map((table) => {
                      const isSelected = selectedTable === table.id;
                      const classes = getTableClasses(table, isSelected);

                      return (
                        <div key={table.id} className="relative">
                          <button
                            onClick={() =>
                              table.available && handleTableSelect(table.id)
                            }
                            disabled={!table.available}
                            className={classes}
                            style={isSelected ? selectedStyle : undefined}
                            role="button"
                            aria-pressed={isSelected}
                            aria-disabled={!table.available}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (
                                table.available &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                handleTableSelect(table.id);
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

          {/* Vacío / sin resultados */}
          {filteredTables.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg mt-6 border-[color:color-mix(in srgb,var(--fg) 20%,transparent)]">
              <Users
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: "color-mix(in srgb, var(--fg) 35%, transparent)" as any }}
              />
              <h3 className="text-lg font-medium mb-2">No hay mesas disponibles</h3>
              <p className="text-muted mb-4">
                Para {reservationData.guests}{" "}
                {reservationData.guests === 1 ? "persona" : "personas"} en este
                horario
              </p>
              <button
                onClick={() => setFilterByCapacity(false)}
                className="font-medium"
                style={{ color: BLUE }}
              >
                Ver todas las mesas
              </button>
            </div>
          )}

          {/* Botones de acción */}
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
              disabled={selectedTable == null}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                selectedTable != null
                  ? "text-white shadow-md hover:shadow-lg"
                  : "cursor-not-allowed opacity-70"
              }`}
              style={
                selectedTable != null
                  ? { backgroundColor: BLUE }
                  : {
                      backgroundColor:
                        "color-mix(in srgb, var(--fg) 18%, transparent)",
                      color: "var(--fg)",
                    }
              }
              type="button"
            >
              {selectedTable != null
                ? `Continuar con Mesa #${selectedTable}`
                : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationMap;
