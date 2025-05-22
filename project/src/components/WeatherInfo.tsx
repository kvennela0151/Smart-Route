import React from 'react';
import { useAppStore } from '../store/appStore';
import { Cloud, CloudRain, CloudSnow, Droplets, Snowflake, Sun, Wind } from 'lucide-react';

export const WeatherInfo: React.FC = () => {
  const { currentWeather, weatherForecast } = useAppStore();

  if (!currentWeather) return null;

  // Helper function to get the weather icon
  const getWeatherIcon = (condition: string, size = 6) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className={`h-${size} w-${size} text-yellow-500`} />;
      case 'rain':
        return <CloudRain className={`h-${size} w-${size} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`h-${size} w-${size} text-gray-400`} />;
      case 'drizzle':
        return <Droplets className={`h-${size} w-${size} text-blue-400`} />;
      case 'thunderstorm':
        return <CloudRain className={`h-${size} w-${size} text-purple-600`} />;
      case 'windy':
        return <Wind className={`h-${size} w-${size} text-blue-300`} />;
      case 'freezing':
        return <Snowflake className={`h-${size} w-${size} text-blue-200`} />;
      default:
        return <Cloud className={`h-${size} w-${size} text-gray-500`} />;
    }
  };

  // Get weather severity class
  const getWeatherSeverityClass = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'cloudy':
      case 'partly cloudy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'drizzle':
      case 'windy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rain':
      case 'snow':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'thunderstorm':
      case 'freezing':
      case 'hail':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Weather Conditions</h2>
      
      {/* Current weather */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getWeatherIcon(currentWeather.main)}
          <div className="ml-3">
            <p className="text-2xl font-bold">{currentWeather.temp}°C</p>
            <p className="text-gray-600">{currentWeather.main}</p>
          </div>
        </div>
        <div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getWeatherSeverityClass(currentWeather.main)}`}>
            {currentWeather.description}
          </div>
          <p className="text-sm text-gray-500 mt-1">Wind: {currentWeather.wind} km/h</p>
        </div>
      </div>
      
      {/* Weather forecast */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Forecast Along Route</h3>
        <div className="grid grid-cols-3 gap-2">
          {weatherForecast.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded p-2 text-center">
              <div className="flex justify-center">
                {getWeatherIcon(item.condition, 4)}
              </div>
              <p className="text-xs mt-1">{item.time}</p>
              <p className="text-sm font-medium">{item.temp}°C</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Weather advisory */}
      {currentWeather.advisory && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-amber-800 text-sm">
            <span className="font-medium">Advisory:</span> {currentWeather.advisory}
          </p>
        </div>
      )}
    </div>
  );
};