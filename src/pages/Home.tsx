import React, { useEffect } from 'react';
import { RouteMap } from '../components/RouteMap';
import { LocationInput } from '../components/LocationInput';
import { WeatherInfo } from '../components/WeatherInfo';
import { RouteInfo } from '../components/RouteInfo';
import { NearbyPlaces } from '../components/NearbyPlaces';
import { ChatInterface } from '../components/ChatInterface';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { Cloud, CloudRain, Compass, LogOut, Sun, User } from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    currentWeather, 
    isLoading, 
    fetchWeatherData, 
    origin, 
    destination 
  } = useAppStore();
  
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (origin && destination) {
      fetchWeatherData();
    }
  }, [origin, destination, fetchWeatherData]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 shadow-lg border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="text-blue-500 h-8 w-8" />
            <h1 className="text-white text-2xl font-bold">Smart Route</h1>
          </div>
          <div className="flex items-center space-x-6">
            {currentWeather && (
              <div className="flex items-center text-gray-300">
                {currentWeather.main === 'Clear' ? (
                  <Sun className="h-6 w-6 mr-2 text-yellow-500" />
                ) : currentWeather.main === 'Rain' ? (
                  <CloudRain className="h-6 w-6 mr-2 text-blue-400" />
                ) : (
                  <Cloud className="h-6 w-6 mr-2 text-gray-400" />
                )}
                <span>{currentWeather.temp}°C</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-5 w-5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <button
              onClick={() => logout()}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Docked Panel */}
        <div className="w-96 bg-white shadow-xl z-10 overflow-y-auto flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              <LocationInput />
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {currentWeather && <WeatherInfo />}
                  {origin && destination && <RouteInfo />}
                  <NearbyPlaces />
                </>
              )}
            </div>
          </div>
          
          {/* Chat Interface - Docked at bottom */}
          <div className="border-t border-gray-200">
            <ChatInterface />
          </div>
        </div>

        {/* Right panel - Map */}
        <div className="flex-1 relative">
          <RouteMap />
        </div>
      </div>
    </div>
  );
};