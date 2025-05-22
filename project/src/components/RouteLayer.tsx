import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/appStore';

export const RouteLayer: React.FC = () => {
  const map = useMap();
  const { 
    origin, 
    destination, 
    currentRoute, 
    alternativeRoute, 
    calculateRoutes, 
    weatherConditions 
  } = useAppStore();

  useEffect(() => {
    if (origin && destination) {
      calculateRoutes();
    }
  }, [origin, destination, calculateRoutes, weatherConditions]);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    if (currentRoute && currentRoute.coordinates.length > 0) {
      // Primary route style
      const routeStyle = {
        color: '#2563EB', // Bright blue
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      };
      
      if (weatherConditions === 'severe') {
        routeStyle.color = '#DC2626'; // Red for severe weather
      } else if (weatherConditions === 'moderate') {
        routeStyle.color = '#F59E0B'; // Amber for moderate weather
      }
      
      const routeLayer = L.polyline(currentRoute.coordinates, routeStyle).addTo(map);
      
      // Add a glowing effect
      const glowStyle = {
        ...routeStyle,
        opacity: 0.15,
        weight: 12
      };
      L.polyline(currentRoute.coordinates, glowStyle).addTo(map);
      
      routeLayer.bindTooltip(currentRoute.duration + " min", {
        permanent: false,
        direction: 'auto',
        className: 'dark-tooltip'
      });
    }
    
    if (alternativeRoute && alternativeRoute.coordinates.length > 0) {
      const altRouteStyle = {
        color: '#6B7280', // Gray color for alternative
        weight: 3,
        opacity: 0.6,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 10'
      };
      
      const altRouteLayer = L.polyline(alternativeRoute.coordinates, altRouteStyle).addTo(map);
      
      altRouteLayer.bindTooltip(alternativeRoute.duration + " min", {
        permanent: false,
        direction: 'auto',
        className: 'dark-tooltip'
      });
    }
  }, [map, currentRoute, alternativeRoute]);

  return null;
};