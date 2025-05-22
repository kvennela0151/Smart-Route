import { create } from 'zustand';
import { calculateRoute } from '../utils/routeUtils';
import { fetchWeatherData, fetchRouteWeather } from '../utils/weatherApi';

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  directions: string[];
  weatherDescription: string;
}

export interface WeatherPoint {
  lat: number;
  lng: number;
  condition: string;
  intensity: number;
}

export interface WeatherAlert {
  lat: number;
  lng: number;
  type: string;
  description: string;
}

export interface Weather {
  temp: number;
  main: string;
  description: string;
  wind: number;
  advisory?: string;
}

interface AppState {
  origin: Location | null;
  destination: Location | null;
  currentLocation: Location | null;
  currentRoute: Route | null;
  alternativeRoute: Route | null;
  isLoading: boolean;
  weatherData: WeatherPoint[];
  weatherAlerts: WeatherAlert[];
  currentWeather: Weather | null;
  weatherForecast: { time: string; temp: number; condition: string }[];
  weatherConditions: 'good' | 'moderate' | 'severe';
  weatherChangedDuringTrip: boolean;
  nearbyPlaces: any[];
  avoidTolls: boolean;
  avoidTraffic: boolean;
  
  setOrigin: (location: Location) => void;
  setDestination: (location: Location) => void;
  updateCurrentLocation: (location: Pick<Location, 'lat' | 'lng'>) => void;
  resetRoute: () => void;
  calculateRoutes: () => void;
  fetchWeatherData: () => Promise<void>;
  switchToAlternativeRoute: () => void;
  getUserLocation: (callback: (position: GeolocationPosition) => void) => void;
  simulateWeatherChange: () => void;
  fetchNearbyPlaces: (type: string, location: Location) => Promise<void>;
  setAvoidTolls: (avoid: boolean) => void;
  setAvoidTraffic: (avoid: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  origin: null,
  destination: null,
  currentLocation: null,
  currentRoute: null,
  alternativeRoute: null,
  isLoading: false,
  weatherData: [],
  weatherAlerts: [],
  currentWeather: null,
  weatherForecast: [],
  weatherConditions: 'good',
  weatherChangedDuringTrip: false,
  nearbyPlaces: [],
  avoidTolls: false,
  avoidTraffic: false,
  
  setOrigin: (location) => {
    set({ origin: location });
  },
  
  setDestination: (location) => {
    set({ destination: location });
  },

  updateCurrentLocation: (location) => {
    set({ 
      currentLocation: { 
        name: 'Current Location',
        ...location 
      } 
    });
  },
  
  resetRoute: () => {
    set({
      origin: null,
      destination: null,
      currentRoute: null,
      alternativeRoute: null,
      weatherData: [],
      weatherAlerts: [],
      currentWeather: null,
      weatherForecast: [],
      weatherChangedDuringTrip: false,
      nearbyPlaces: [],
    });
  },
  
  calculateRoutes: async () => {
    const { origin, destination/*, avoidTolls, avoidTraffic*/ } = get();

    if (!origin || !destination) return;

    set({ isLoading: true });

    try {
      // Calculate main and alternative routes
      const mainRoute = calculateRoute(origin, destination, get().weatherConditions, false);
      const altRoute = calculateRoute(origin, destination, get().weatherConditions, true);

      // Fetch weather data along both routes
      const [mainWeather, altWeather] = await Promise.all([
        fetchRouteWeather(mainRoute.coordinates),
        fetchRouteWeather(altRoute.coordinates)
      ]);

      // Update routes with weather information
      set({
        currentRoute: {
          ...mainRoute,
          weatherData: mainWeather
        },
        alternativeRoute: {
          ...altRoute,
          weatherData: altWeather
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Error calculating routes:', error);
      set({ isLoading: false });
    }
  },
  
  fetchWeatherData: async () => {
    const { origin, destination } = get();
    if (!origin || !destination) return;
    
    set({ isLoading: true });
    
    try {
      const [originWeather, destWeather] = await Promise.all([
        fetchWeatherData(origin.lat, origin.lng),
        fetchWeatherData(destination.lat, destination.lng)
      ]);
      
      set({
        currentWeather: originWeather.current,
        weatherForecast: originWeather.forecast,
        weatherConditions: getWorstWeatherCondition(originWeather, destWeather),
        isLoading: false,
      });
      
      // Recalculate routes with new weather data
      get().calculateRoutes();
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      set({ isLoading: false });
    }
  },
  
  switchToAlternativeRoute: () => {
    const { alternativeRoute } = get();
    
    if (alternativeRoute) {
      set(state => ({
        currentRoute: alternativeRoute,
        alternativeRoute: state.currentRoute,
      }));
    }
  },
  
  getUserLocation: (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback, (error) => {
        console.error('Error getting user location:', error);
        alert('Unable to retrieve your location. Please enter it manually.');
      });
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  },
  
  simulateWeatherChange: () => {
    const { origin, destination } = get();
    
    if (!origin || !destination) return;
    
    set(state => ({
      weatherChangedDuringTrip: true,
      weatherConditions: state.weatherConditions === 'good' ? 'moderate' : 'severe',
    }));
    
    // Recalculate routes with new weather conditions
    get().calculateRoutes();
  },

  fetchNearbyPlaces: async (type: string, location: Location) => {
    set({ isLoading: true });
    try {
      // In production, this would make a real API call to a places service
      // For now, we'll use mock data
      const mockPlaces = [
        { id: 1, name: 'Sample Hotel', type: 'hotel', distance: 0.5, rating: 4.5 },
        { id: 2, name: 'City Hospital', type: 'hospital', distance: 1.2, rating: 4.8 },
        { id: 3, name: 'Restaurant', type: 'restaurant', distance: 0.3, rating: 4.2 },
      ];
      
      set({ nearbyPlaces: mockPlaces, isLoading: false });
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      set({ isLoading: false });
    }
  },

  setAvoidTolls: (avoid) => {
    set({ avoidTolls: avoid });
    const { origin, destination } = get();
    if (origin && destination) {
      get().calculateRoutes();
    }
  },

  setAvoidTraffic: (avoid) => {
    set({ avoidTraffic: avoid });
    const { origin, destination } = get();
    if (origin && destination) {
      get().calculateRoutes();
    }
  },
}));

const getWorstWeatherCondition = (
  originWeather: { current: Weather },
  destWeather: { current: Weather }
): 'good' | 'moderate' | 'severe' => {
  const conditions = [originWeather.current.main, destWeather.current.main];
  
  if (conditions.some(c => ['Thunderstorm', 'Snow', 'Tornado'].includes(c))) {
    return 'severe';
  }
  
  if (conditions.some(c => ['Rain', 'Drizzle', 'Fog'].includes(c))) {
    return 'moderate';
  }
  
  return 'good';
};