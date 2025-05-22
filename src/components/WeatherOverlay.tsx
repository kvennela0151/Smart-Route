import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/appStore';

export const WeatherOverlay: React.FC = () => {
  const map = useMap();
  const { weatherData, weatherAlerts } = useAppStore();

  // Update weather overlays when weather data changes
  useEffect(() => {
    // Clear existing weather overlays
    map.eachLayer((layer) => {
      if (layer._weatherOverlay) {
        map.removeLayer(layer);
      }
    });

    // If we have weather data, add rain/cloud overlays
    if (weatherData && weatherData.length > 0) {
      weatherData.forEach((point) => {
        if (point.condition === 'rain' || point.condition === 'snow') {
          // Create a circular overlay for rain or snow
          const circle = L.circle([point.lat, point.lng], {
            color: point.condition === 'rain' ? '#3B82F6' : '#94A3B8',
            fillColor: point.condition === 'rain' ? '#93C5FD' : '#E2E8F0',
            fillOpacity: 0.3,
            radius: point.intensity * 1000, // Intensity determines radius
            interactive: false,
          });
          
          // Add a custom property to identify this as a weather overlay
          circle._weatherOverlay = true;
          
          circle.addTo(map);
        }
      });
    }
    
    // Add weather alerts as markers
    if (weatherAlerts && weatherAlerts.length > 0) {
      weatherAlerts.forEach((alert) => {
        const alertIcon = L.divIcon({
          html: `<div class="bg-red-500 text-white p-1 rounded-full flex items-center justify-center" style="width: 24px; height: 24px;">⚠️</div>`,
          className: 'weather-alert-icon',
          iconSize: [24, 24],
        });
        
        const marker = L.marker([alert.lat, alert.lng], { icon: alertIcon });
        marker._weatherOverlay = true;
        
        marker.bindPopup(`<strong>${alert.type}</strong><br>${alert.description}`);
        marker.addTo(map);
      });
    }
  }, [map, weatherData, weatherAlerts]);

  return null;
};