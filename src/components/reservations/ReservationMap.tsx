// components/reservations/ReservationMap.tsx
import React, { useState, useEffect } from 'react';
import { Users, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useReservation } from '../../sections/homepage/reservationpage';
import type { TableInfo } from '../../types/reservation';


const ReservationMap: React.FC = () => {
  const { reservationData, updateReservationData, nextStep, prevStep } = useReservation();
  const [selectedTable, setSelectedTable] = useState<number | null>(reservationData.tableId);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [filterByCapacity, setFilterByCapacity] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulamos la carga de mesas desde el backend
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      
      // Simulamos delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados de mesas
      const mockTables: TableInfo[] = [
        // Zona terraza
        { id: 1, seats: 2, available: true, location: 'terraza' },
        { id: 2, seats: 2, available: false, location: 'terraza' },
        { id: 3, seats: 4, available: true, location: 'terraza' },
        { id: 4, seats: 4, available: true, location: 'terraza' },
        { id: 5, seats: 6, available: false, location: 'terraza' },
        
        // Zona interior
        { id: 6, seats: 2, available: true, location: 'interior' },
        { id: 7, seats: 2, available: true, location: 'interior' },
        { id: 8, seats: 4, available: false, location: 'interior' },
        { id: 9, seats: 4, available: true, location: 'interior' },
        { id: 10, seats: 6, available: true, location: 'interior' },
        { id: 11, seats: 8, available: true, location: 'interior' },
        
        // Zona privada
        { id: 12, seats: 6, available: true, location: 'privada' },
        { id: 13, seats: 8, available: false, location: 'privada' },
        { id: 14, seats: 10, available: true, location: 'privada' },
        
        // Zona bar
        { id: 15, seats: 2, available: true, location: 'bar' },
        { id: 16, seats: 2, available: true, location: 'bar' },
        { id: 17, seats: 3, available: false, location: 'bar' },
        { id: 18, seats: 4, available: true, location: 'bar' }
      ];
      
      setTables(mockTables);
      setIsLoading(false);
    };

    fetchTables();
  }, []);

  const getFilteredTables = (): TableInfo[] => {
    if (!filterByCapacity) return tables;
    
    const requiredSeats = reservationData.guests;
    return tables.filter(table => table.seats >= requiredSeats);
  };

  const getTablesByLocation = (location: string): TableInfo[] => {
    return getFilteredTables().filter(table => table.location === location);
  };

  const handleTableSelect = (tableId: number) => {
    if (selectedTable === tableId) {
      setSelectedTable(null);
    } else {
      setSelectedTable(tableId);
    }
  };

  const handleContinue = () => {
    if (selectedTable) {
      updateReservationData({ tableId: selectedTable });
      nextStep();
    }
  };

  const handleBack = () => {
    if (selectedTable) {
      updateReservationData({ tableId: selectedTable });
    }
    prevStep();
  };

  const getTableStatusColor = (table: TableInfo, isSelected: boolean): string => {
    if (isSelected) return 'bg-red-500 border-red-600 text-white';
    if (!table.available) return 'bg-gray-200 border-gray-300 text-gray-500';
    return 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:bg-red-50';
  };

  const getLocationTitle = (location: string): string => {
    const titles = {
      'terraza': 'Terraza',
      'interior': 'Salón Interior',
      'privada': 'Área Privada',
      'bar': 'Zona Bar'
    };
    return titles[location as keyof typeof titles] || location;
  };

  const getLocationDescription = (location: string): string => {
    const descriptions = {
      'terraza': 'Vista al jardín con ambiente relajado',
      'interior': 'Ambiente acogedor y climatizado',
      'privada': 'Perfecta para eventos especiales',
      'bar': 'Ambiente casual junto a la barra'
    };
    return descriptions[location as keyof typeof descriptions] || '';
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando disponibilidad de mesas...</p>
        </div>
      </div>
    );
  }

  const filteredTables = getFilteredTables();
  const locations = ['terraza', 'interior', 'privada', 'bar'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona tu Mesa</h2>
        <p className="text-gray-600">Elige la mesa perfecta para tu experiencia gastronómica</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Reservation Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-3">Tu Reserva</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{formatDate(reservationData.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{reservationData.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{reservationData.guests} {reservationData.guests === 1 ? 'persona' : 'personas'}</span>
              </div>
            </div>

            {selectedTable && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-1">Mesa Seleccionada</h4>
                <p className="text-sm text-red-600">
                  Mesa #{selectedTable} - {tables.find(t => t.id === selectedTable)?.seats} asientos
                </p>
                <p className="text-xs text-red-500 mt-1">
                  {getLocationTitle(tables.find(t => t.id === selectedTable)?.location || '')}
                </p>
              </div>
            )}

            {/* Filter Toggle */}
            <div className="mt-4 p-3 border rounded-lg">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterByCapacity}
                  onChange={(e) => setFilterByCapacity(e.target.checked)}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span>Solo mostrar mesas adecuadas</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Filtrar por capacidad mínima requerida
              </p>
            </div>

            {/* Legend */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Leyenda</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span>Seleccionada</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                  <span>Ocupada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Map */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {locations.map(location => {
              const locationTables = getTablesByLocation(location);
              if (locationTables.length === 0) return null;

              return (
                <div key={location} className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-red-500 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{getLocationTitle(location)}</h3>
                      <p className="text-sm text-gray-600">{getLocationDescription(location)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {locationTables.map(table => (
                      <button
                        key={table.id}
                        onClick={() => table.available && handleTableSelect(table.id)}
                        disabled={!table.available}
                        className={`
                          p-4 border-2 rounded-lg transition-all duration-200 text-center
                          ${getTableStatusColor(table, selectedTable === table.id)}
                          ${table.available ? 'cursor-pointer' : 'cursor-not-allowed'}
                        `}
                      >
                        <div className="font-medium">Mesa #{table.id}</div>
                        <div className="text-sm flex items-center justify-center mt-1">
                          <Users className="w-3 h-3 mr-1" />
                          {table.seats}
                        </div>
                        {selectedTable === table.id && (
                          <CheckCircle className="w-4 h-4 mx-auto mt-2" />
                        )}
                        {!table.available && selectedTable !== table.id && (
                          <XCircle className="w-4 h-4 mx-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTables.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay mesas disponibles
              </h3>
              <p className="text-gray-500 mb-4">
                Para {reservationData.guests} {reservationData.guests === 1 ? 'persona' : 'personas'} en este horario
              </p>
              <button
                onClick={() => setFilterByCapacity(false)}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Ver todas las mesas
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Volver
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedTable}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
                ${selectedTable
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Continuar con Mesa #{selectedTable || '---'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationMap;