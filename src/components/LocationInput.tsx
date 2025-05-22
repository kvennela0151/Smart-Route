import React, { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { MapPin, Navigation, RotateCcw, Car, DollarSign } from 'lucide-react';
import Autosuggest from 'react-autosuggest';

interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
}

export const LocationInput: React.FC = () => {
  const { 
    setOrigin, 
    setDestination, 
    resetRoute,
    getUserLocation,
    avoidTolls,
    setAvoidTolls,
    avoidTraffic,
    setAvoidTraffic
  } = useAppStore();
  
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  
  const fetchSuggestions = useCallback(async (value: string): Promise<LocationSuggestion[]> => {
    if (!value) return [];
    
    try {
      // In production, this would use a real geocoding API
      return [
        { name: `${value} Main St`, lat: 40.7128, lng: -74.0060 },
        { name: `${value} Broadway`, lat: 40.7589, lng: -73.9851 },
        { name: `${value} Park Ave`, lat: 40.7505, lng: -73.9764 }
      ];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (originInput && destinationInput) {
      // In production, these would be real geocoded coordinates
      setOrigin({
        name: originInput,
        lat: 40.7128,
        lng: -74.0060
      });
      
      setDestination({
        name: destinationInput,
        lat: 40.7589,
        lng: -73.9851
      });
    }
  };
  
  const handleReset = () => {
    setOriginInput('');
    setDestinationInput('');
    resetRoute();
  };
  
  const handleUseCurrentLocation = () => {
    getUserLocation((position) => {
      setOriginInput('Current Location');
      setOrigin({
        name: 'Current Location',
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800">Plan Your Route</h2>
      
      {/* Origin Input with Autosuggest */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <Autosuggest
          suggestions={originSuggestions}
          onSuggestionsFetchRequested={async ({ value }) => {
            const suggestions = await fetchSuggestions(value);
            setOriginSuggestions(suggestions);
          }}
          onSuggestionsClearRequested={() => setOriginSuggestions([])}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => (
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              {suggestion.name}
            </div>
          )}
          inputProps={{
            placeholder: 'Starting point',
            value: originInput,
            onChange: (_, { newValue }) => setOriginInput(newValue),
            className: "block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }}
          theme={{
            container: 'relative',
            suggestionsContainer: 'absolute w-full mt-1 bg-white shadow-lg rounded-md z-10',
            suggestionsList: 'max-h-48 overflow-auto rounded-md',
          }}
        />
        <button 
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>
      
      {/* Destination Input with Autosuggest */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <Autosuggest
          suggestions={destSuggestions}
          onSuggestionsFetchRequested={async ({ value }) => {
            const suggestions = await fetchSuggestions(value);
            setDestSuggestions(suggestions);
          }}
          onSuggestionsClearRequested={() => setDestSuggestions([])}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => (
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
              {suggestion.name}
            </div>
          )}
          inputProps={{
            placeholder: 'Destination',
            value: destinationInput,
            onChange: (_, { newValue }) => setDestinationInput(newValue),
            className: "block w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }}
          theme={{
            container: 'relative',
            suggestionsContainer: 'absolute w-full mt-1 bg-white shadow-lg rounded-md z-10',
            suggestionsList: 'max-h-48 overflow-auto rounded-md',
          }}
        />
      </div>
      
      {/* Route Options */}
      <div className="flex space-x-4 text-sm">
        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            checked={avoidTolls}
            onChange={(e) => setAvoidTolls(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <DollarSign className="h-4 w-4" />
          <span>Avoid Tolls</span>
        </label>
        
        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            checked={avoidTraffic}
            onChange={(e) => setAvoidTraffic(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <Car className="h-4 w-4" />
          <span>Avoid Traffic</span>
        </label>
      </div>
      
      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Route
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};