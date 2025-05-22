import { Route, Location, WeatherPoint, WeatherAlert } from '../store/appStore';

// Function to calculate a route between two points
export const calculateRoute = (
  origin: Location, 
  destination: Location, 
  weatherCondition: 'good' | 'moderate' | 'severe' = 'good',
  isAlternative = false
): Route => {
  // This would use a real routing API in production
  // For now, we'll create mock routes
  
  // Create a "direct" line between the two points
  const directCoords: [number, number][] = [];
  const numPoints = 10;
  
  // Get straight-line points
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    directCoords.push([
      origin.lat + (destination.lat - origin.lat) * ratio,
      origin.lng + (destination.lng - origin.lng) * ratio
    ]);
  }
  
  // For the alternative route, add some deviation
  const finalCoords = isAlternative 
    ? directCoords.map((coord, idx) => {
        if (idx > 0 && idx < numPoints) {
          // Add some random deviation to make it look like an alternative route
          const offset = isAlternative ? 0.05 : 0.02;
          return [
            coord[0] + (Math.random() - 0.5) * offset,
            coord[1] + (Math.random() - 0.5) * offset
          ] as [number, number];
        }
        return coord;
      })
    : directCoords;
  
  // Calculate a realistic distance
  const distance = calculateDistance(origin, destination);
  
  // Calculate duration based on distance and weather
  let duration = Math.round(distance * 1.2); // Average speed assumption
  
  // Weather affects duration
  if (weatherCondition === 'moderate') {
    duration = Math.round(duration * 1.3); // 30% slower in moderate weather
  } else if (weatherCondition === 'severe') {
    duration = Math.round(duration * 1.8); // 80% slower in severe weather
  }
  
  // For alternative route, adjust duration and distance
  if (isAlternative) {
    // Alternative route might be longer but safer
    duration = Math.round(duration * (weatherCondition === 'severe' ? 0.9 : 1.15));
    // Alternative distance is slightly longer
    const altDistance = distance * 1.1;
    
    return {
      coordinates: finalCoords,
      distance: Math.round(altDistance * 10) / 10,
      duration,
      directions: generateDirections(altDistance, weatherCondition, isAlternative),
      weatherDescription: getWeatherDescription(weatherCondition, isAlternative),
    };
  }
  
  return {
    coordinates: finalCoords,
    distance: Math.round(distance * 10) / 10,
    duration,
    directions: generateDirections(distance, weatherCondition, isAlternative),
    weatherDescription: getWeatherDescription(weatherCondition, isAlternative),
  };
};

// Function to calculate distance between two points (Haversine formula)
const calculateDistance = (from: Location, to: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10;
};

// Convert degrees to radians
const toRad = (value: number) => value * Math.PI / 180;

// Generate mock directions
const generateDirections = (
  distance: number, 
  weatherCondition: 'good' | 'moderate' | 'severe',
  isAlternative: boolean
): string[] => {
  const directions = [
    `Start from your location and head ${['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)]}`,
    `Continue straight for ${(distance * 0.2).toFixed(1)} km`,
  ];
  
  // Add weather-specific directions
  if (weatherCondition === 'moderate') {
    directions.push(`Caution: Light rain expected for the next ${(distance * 0.3).toFixed(1)} km`);
  } else if (weatherCondition === 'severe') {
    directions.push(`Warning: Heavy rain ahead. Reduced visibility for ${(distance * 0.4).toFixed(1)} km`);
    
    if (!isAlternative) {
      directions.push(`Consider taking the alternative route to avoid severe weather`);
    } else {
      directions.push(`This route avoids the most severe weather conditions`);
    }
  }
  
  directions.push(
    `Turn ${ ['left', 'right'][Math.floor(Math.random() * 2)] } onto Main Street`,
    `Continue for ${(distance * 0.3).toFixed(1)} km`,
    `Turn ${ ['left', 'right'][Math.floor(Math.random() * 2)] } onto ${isAlternative ? 'Scenic Drive' : 'Highway 101'}`,
    `Continue for ${(distance * 0.4).toFixed(1)} km`,
    `You have arrived at your destination`
  );
  
  return directions;
};

// Get weather description based on condition and route type
const getWeatherDescription = (
  condition: 'good' | 'moderate' | 'severe',
  isAlternative: boolean
): string => {
  if (condition === 'good') {
    return 'Clear conditions';
  }
  
  if (condition === 'moderate') {
    return isAlternative 
      ? 'Light rain, good visibility' 
      : 'Light rain throughout';
  }
  
  // Severe conditions
  return isAlternative 
    ? 'Some heavy rain, but safer route' 
    : 'Heavy rain, reduced visibility';
};

// Simulate a weather change during the trip
export const simulateWeatherChange = (origin: Location, destination: Location) => {
  // Calculate new routes based on changed weather
  const mainRoute = calculateRoute(origin, destination, 'moderate');
  const altRoute = calculateRoute(origin, destination, 'moderate', true);
  
  // Generate new weather data points to match the changed conditions
  const weatherPoints: WeatherPoint[] = [];
  const weatherAlerts: WeatherAlert[] = [];
  
  // Add more intense rain areas
  const numWeatherPoints = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < numWeatherPoints; i++) {
    const ratio = 0.3 + (Math.random() * 0.4); // Focus in the middle of the route
    const point = {
      lat: origin.lat + (destination.lat - origin.lat) * ratio,
      lng: origin.lng + (destination.lng - origin.lng) * ratio,
      condition: 'rain',
      intensity: Math.random() * 0.3 + 0.7, // Higher intensity
    };
    weatherPoints.push(point);
  }
  
  // Add a weather alert for the changed conditions
  weatherAlerts.push({
    lat: origin.lat + (destination.lat - origin.lat) * 0.5,
    lng: origin.lng + (destination.lng - origin.lng) * 0.5,
    type: 'Sudden Rain',
    description: 'Heavy rain has developed. Route adjusted for safety.'
  });
  
  return {
    routes: {
      main: mainRoute,
      alternative: altRoute
    },
    weatherData: weatherPoints,
    weatherAlerts,
  };
};