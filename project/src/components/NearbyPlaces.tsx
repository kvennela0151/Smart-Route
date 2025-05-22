import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Hotel, Guitar as Hospital, Coffee, Store, Fuel, ParkingMeter as Parking } from 'lucide-react';

type PlaceType = 'hotels' | 'hospitals' | 'restaurants' | 'stores' | 'fuel' | 'parking';

interface Place {
  id: string;
  name: string;
  type: PlaceType;
  distance: number;
  rating: number;
  address: string;
}

export const NearbyPlaces: React.FC = () => {
  const [selectedType, setSelectedType] = useState<PlaceType>('hotels');
  const { currentLocation } = useAppStore();

  const placeTypes = [
    { type: 'hotels' as PlaceType, icon: Hotel, label: 'Hotels' },
    { type: 'hospitals' as PlaceType, icon: Hospital, label: 'Hospitals' },
    { type: 'restaurants' as PlaceType, icon: Coffee, label: 'Restaurants' },
    { type: 'stores' as PlaceType, icon: Store, label: 'Stores' },
    { type: 'fuel' as PlaceType, icon: Fuel, label: 'Gas Stations' },
    { type: 'parking' as PlaceType, icon: Parking, label: 'Parking' },
  ];

  // Mock data - In production, this would come from a real API
  const mockPlaces: Place[] = [
    { id: '1', name: 'Grand Hotel', type: 'hotels', distance: 0.5, rating: 4.5, address: '123 Main St' },
    { id: '2', name: 'City Hospital', type: 'hospitals', distance: 1.2, rating: 4.8, address: '456 Health Ave' },
    { id: '3', name: 'Cafe Central', type: 'restaurants', distance: 0.3, rating: 4.2, address: '789 Food Lane' },
  ];

  const filteredPlaces = mockPlaces.filter(place => place.type === selectedType);

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Nearby Places</h2>
      
      {/* Place type selector */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {placeTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 whitespace-nowrap ${
              selectedType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </button>
        ))}
      </div>

      {/* Places list */}
      <div className="space-y-3">
        {filteredPlaces.map(place => (
          <div
            key={place.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center">
              {React.createElement(placeTypes.find(t => t.type === place.type)?.icon || Store, {
                className: "h-5 w-5 text-gray-600 mr-3"
              })}
              <div>
                <h3 className="font-medium text-gray-800">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{place.distance} km</p>
              <div className="flex items-center text-sm text-yellow-500">
                {'★'.repeat(Math.floor(place.rating))}
                <span className="ml-1 text-gray-600">({place.rating})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {selectedType} found nearby
        </div>
      )}
    </div>
  );
};