import React, { useEffect, useRef, useState, memo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading Google Maps...</div>
        </div>
      </div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-64 bg-red-100 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600">
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Google Maps Error
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            Unable to load Google Maps. This could be due to:
          </p>
          <div className="text-xs text-red-500 dark:text-red-500 space-y-1 text-left">
            <p>• API key restrictions or billing issues</p>
            <p>• Required APIs not enabled</p>
            <p>• Network connectivity issues</p>
            <p>• Browser security settings</p>
          </div>
        </div>
      </div>;
    default:
      return null;
  }
};

const MapComponent = ({ center, zoom, onLocationSelect, currentLocation }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add click listener to map
      newMap.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onLocationSelect({ latitude: lat, longitude: lng });
      });

      setMap(newMap);
    }
  }, [center, zoom, onLocationSelect]);

  useEffect(() => {
    if (map && currentLocation) {
      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      const newMarker = new window.google.maps.Marker({
        position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        map: map,
        title: 'Issue Location',
        draggable: true
      });

      // Add drag listener to marker
      newMarker.addListener('dragend', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onLocationSelect({ latitude: lat, longitude: lng });
      });

      markerRef.current = newMarker;
    }
  }, [map, currentLocation, onLocationSelect]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const GoogleMap = memo(({ center, zoom = 15, onLocationSelect, currentLocation, className = "" }) => {
  // Use the provided API key
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCL6nYRqmSxV7e3j-ephRZ-xbCHBwkmB8U';

  // Debug logging
  console.log('GoogleMap: API Key available:', !!apiKey);
  console.log('GoogleMap: Center:', center);
  console.log('GoogleMap: Current Location:', currentLocation);

  return (
    <div className={`w-full ${className}`}>
      <Wrapper 
        apiKey={apiKey} 
        render={render}
        libraries={['places']}
      >
        <MapComponent
          center={center}
          zoom={zoom}
          onLocationSelect={onLocationSelect}
          currentLocation={currentLocation}
        />
      </Wrapper>
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;
