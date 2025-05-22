import React from 'react';
import { useAppStore } from '../store/appStore';
import { AlertTriangle, Clock, MapPin, RotateCw, Umbrella } from 'lucide-react';

export const RouteInfo: React.FC = () => {
  const { 
    currentRoute, 
    alternativeRoute, 
    weatherConditions, 
    switchToAlternativeRoute, 
    weatherChangedDuringTrip 
  } = useAppStore();

  if (!currentRoute) return null;

  // Determine if we should show the alert for weather changes
  const showWeatherAlert = weatherChangedDuringTrip || weatherConditions === 'severe';

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Route Information</h2>
      
      {/* Primary route info */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Primary Route
          </h3>
          <div className="text-sm text-gray-500">
            <Clock className="h-4 w-4 inline mr-1" />
            {currentRoute.duration} min
          </div>
        </div>
        
        <div className="ml-5 mt-2">
          <p className="text-sm">Distance: {currentRoute.distance} km</p>
          <p className="text-sm">Weather Condition: {weatherConditions}</p>
        </div>
      </div>
      
      {/* Alternative route if available */}
      {alternativeRoute && (
        <div className="mb-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Alternative Route
            </h3>
            <div className="text-sm text-gray-500">
              <Clock className="h-4 w-4 inline mr-1" />
              {alternativeRoute.duration} min
            </div>
          </div>
          
          <div className="ml-5 mt-2">
            <p className="text-sm">Distance: {alternativeRoute.distance} km</p>
            <p className="text-sm">Weather: {alternativeRoute.weatherDescription}</p>
          </div>
          
          <button 
            onClick={switchToAlternativeRoute}
            className="ml-5 mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Switch to this route
          </button>
        </div>
      )}
      
      {/* Weather change alert */}
      {showWeatherAlert && (
        <div className={`mt-4 p-3 rounded-md ${weatherConditions === 'severe' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${weatherConditions === 'severe' ? 'text-red-500' : 'text-amber-500'}`} />
            <div className="ml-2">
              <p className={`text-sm font-medium ${weatherConditions === 'severe' ? 'text-red-800' : 'text-amber-800'}`}>
                {weatherConditions === 'severe' ? 'Severe Weather Alert' : 'Weather Change Detected'}
              </p>
              <p className="text-sm mt-1">
                {weatherChangedDuringTrip 
                  ? 'Weather conditions have changed. We\'ve updated your route to avoid problematic areas.'
                  : 'Severe weather conditions detected on your route. Consider the alternative route for a safer journey.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Turn-by-turn directions */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Turn-by-turn Directions</h3>
        <ul className="space-y-2">
          {currentRoute.directions.map((step, index) => (
            <li key={index} className="text-sm flex">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <span>{step}</span>
              {step.includes('rain') && <Umbrella className="h-4 w-4 text-blue-500 ml-2 mt-0.5" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};