import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const createCustomIcon = (color = '#3B82F6') => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

// Component to handle map events
const MapEvents = ({ onLocationSelect, currentLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null);
  
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const newPosition = [lat, lng];
      setMarkerPosition(newPosition);
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  // Update marker position when currentLocation changes
  useEffect(() => {
    if (currentLocation) {
      setMarkerPosition([currentLocation.latitude, currentLocation.longitude]);
    }
  }, [currentLocation]);

  return markerPosition ? (
    <Marker 
      position={markerPosition} 
      icon={createCustomIcon('#3B82F6')}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setMarkerPosition([lat, lng]);
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      }}
    >
      <Popup>
        <div className="text-center">
          <p className="font-medium text-gray-900">Issue Location</p>
          <p className="text-sm text-gray-600">
            {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Drag to adjust position</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

const GoogleMap = memo(({ center, zoom = 15, onLocationSelect, currentLocation, className = "" }) => {
  const [mapCenter, setMapCenter] = useState(center || [26.8467, 80.9462]); // Default to Lucknow
  
  // Update map center when center prop changes
  useEffect(() => {
    if (center) {
      setMapCenter([center.lat, center.lng]);
    }
  }, [center]);

  const handleLocationSelect = useCallback((location) => {
    onLocationSelect(location);
  }, [onLocationSelect]);

  return (
    <div className={`w-full ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-64 rounded-lg z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents 
          onLocationSelect={handleLocationSelect}
          currentLocation={currentLocation}
        />
      </MapContainer>
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;