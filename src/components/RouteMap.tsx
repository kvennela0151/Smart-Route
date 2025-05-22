import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useAppStore } from '../store/appStore';
import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

const RouteMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const { 
    origin, 
    destination, 
    weatherData,
    weatherAlerts,
    weatherConditions,
    currentLocation,
    updateCurrentLocation
  } = useAppStore();

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([20.5937, 78.9629], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add location tracking
      mapRef.current.locate({
        watch: true,
        enableHighAccuracy: true
      });

      mapRef.current.on('locationfound', (e) => {
        updateCurrentLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });

        // Update current location marker
        if (!mapRef.current) return;
        
        const locationIcon = L.divIcon({
          html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
          className: 'location-marker'
        });

        L.marker([e.latlng.lat, e.latlng.lng], { icon: locationIcon })
          .addTo(mapRef.current)
          .bindPopup('Your current location')
          .openPopup();
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !origin || !destination) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    const waypoints = [
      L.latLng(origin.lat, origin.lng),
      L.latLng(destination.lat, destination.lng)
    ];

    routingControlRef.current = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: {
        styles: [{
          color: getRouteColor(weatherConditions),
          weight: 6,
          opacity: 0.8
        }]
      },
      createMarker: (i, wp) => {
        const icon = L.divIcon({
          html: `<div class="w-6 h-6 rounded-full flex items-center justify-center ${i === 0 ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg">
            ${i === 0 ? '🏁' : '🎯'}
          </div>`,
          className: 'custom-marker'
        });
        return L.marker(wp.latLng, { icon });
      }
    }).addTo(mapRef.current);

    // Add weather markers along the route
    if (weatherData) {
      weatherData.forEach((point) => {
        if (!mapRef.current) return;

        const weatherIcon = getWeatherIcon(point.condition);
        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            html: `<div class="weather-marker p-2 rounded-lg bg-white shadow-lg">
              ${weatherIcon}
              <span class="ml-2">${point.temp}°C</span>
            </div>`,
            className: 'weather-marker'
          })
        }).addTo(mapRef.current);

        marker.bindPopup(`
          <div class="p-2">
            <strong>${point.condition}</strong><br>
            Temperature: ${point.temp}°C<br>
            Wind: ${point.windSpeed} km/h
          </div>
        `);
      });
    }

    // Add weather alerts
    if (weatherAlerts) {
      weatherAlerts.forEach((alert) => {
        if (!mapRef.current) return;

        const alertMarker = L.marker([alert.lat, alert.lng], {
          icon: L.divIcon({
            html: `<div class="alert-marker p-2 rounded-lg bg-red-500 text-white">⚠️</div>`,
            className: 'alert-marker'
          })
        }).addTo(mapRef.current);

        alertMarker.bindPopup(`
          <div class="p-2">
            <strong class="text-red-500">${alert.type}</strong><br>
            ${alert.description}
          </div>
        `);
      });
    }
  }, [origin, destination, weatherData, weatherAlerts, weatherConditions]);

  const getRouteColor = (condition: 'good' | 'moderate' | 'severe'): string => {
    switch (condition) {
      case 'good': return '#2563EB';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#DC2626';
      default: return '#2563EB';
    }
  };

  const getWeatherIcon = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'rain': return '🌧️';
      case 'snow': return '🌨️';
      case 'clouds': return '☁️';
      case 'thunderstorm': return '⛈️';
      default: return '🌥️';
    }
  };

  return (
    <div id="map" className="w-full h-full rounded-lg overflow-hidden shadow-xl" />
  );
};

export default RouteMap;