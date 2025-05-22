import axios from 'axios';
import { Weather } from '../store/appStore';

const OPENWEATHER_API_KEY = '7cb3faafa7195a32c933f91a539af52e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (lat: number, lon: number): Promise<{
  current: Weather;
  forecast: { time: string; temp: number; condition: string }[];
}> => {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`),
      axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`)
    ]);

    const current: Weather = {
      temp: Math.round(currentRes.data.main.temp),
      main: currentRes.data.weather[0].main,
      description: currentRes.data.weather[0].description,
      wind: Math.round(currentRes.data.wind.speed * 3.6), // Convert m/s to km/h
      advisory: getWeatherAdvisory(currentRes.data.weather[0].id)
    };

    const forecast = forecastRes.data.list.slice(0, 3).map((item: any) => ({
      time: new Date(item.dt * 1000).getHours() + ':00',
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main.toLowerCase()
    }));

    return { current, forecast };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchRouteWeather = async (coordinates: [number, number][]): Promise<any[]> => {
  try {
    // Sample points along the route for weather data
    const sampledPoints = sampleRoutePoints(coordinates, 3);
    
    const weatherPromises = sampledPoints.map(([lat, lon]) =>
      axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`)
    );

    const responses = await Promise.all(weatherPromises);
    
    return responses.map((res, index) => ({
      position: sampledPoints[index],
      condition: res.data.weather[0].main,
      temp: Math.round(res.data.main.temp),
      windSpeed: Math.round(res.data.wind.speed * 3.6),
      severity: getWeatherSeverity(res.data.weather[0].id)
    }));
  } catch (error) {
    console.error('Error fetching route weather:', error);
    throw error;
  }
};

const getWeatherAdvisory = (weatherId: number): string | undefined => {
  if (weatherId >= 200 && weatherId < 300) return 'Thunderstorm warning. Consider postponing travel.';
  if (weatherId >= 500 && weatherId < 600) return 'Rainy conditions. Drive carefully.';
  if (weatherId >= 600 && weatherId < 700) return 'Snowy conditions. Reduced visibility.';
  if (weatherId >= 700 && weatherId < 800) return 'Poor visibility conditions.';
  return undefined;
};

const getWeatherSeverity = (weatherId: number): 'good' | 'moderate' | 'severe' => {
  if (weatherId === 800) return 'good'; // Clear sky
  if (weatherId > 800 && weatherId < 804) return 'good'; // Clouds
  if ((weatherId >= 500 && weatherId <= 504) || (weatherId >= 520 && weatherId <= 524)) return 'moderate'; // Rain
  return 'severe'; // All other conditions
};

const sampleRoutePoints = (coordinates: [number, number][], numPoints: number): [number, number][] => {
  if (coordinates.length < 2) return [];
  
  const result: [number, number][] = [];
  const step = Math.floor(coordinates.length / (numPoints + 1));
  
  for (let i = 1; i <= numPoints; i++) {
    const index = Math.min(i * step, coordinates.length - 1);
    result.push(coordinates[index]);
  }
  
  return result;
};