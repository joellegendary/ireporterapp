import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

// Component to handle map click events
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ 
  onLocationSelect 
}) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [map, setMap] = useState<L.Map | null>(null);

  // Default center (Nairobi, Kenya)
  const defaultCenter: [number, number] = [-1.286389, 36.817223];
  
  // Set initial location when component mounts
  useEffect(() => {
    if (initialLocation && map) {
      setSelectedLocation(initialLocation);
      map.setView([initialLocation.lat, initialLocation.lng], 13);
    }
  }, [initialLocation, map]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const location = { lat, lng };
    setSelectedLocation(location);
    onLocationSelect(lat, lng);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(location);
          onLocationSelect(location.lat, location.lng);
          
          // Pan map to current location
          if (map) {
            map.setView([location.lat, location.lng], 15);
          }
        },
        (error) => {
          let errorMessage = 'Unable to get your location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location permissions in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="map-picker">
      <div className="map-header">
        <h3 className="map-title">Select Location</h3>
        <button 
          type="button"
          className="location-btn"
          onClick={getCurrentLocation}
        >
          📍 Use My Location
        </button>
      </div>

      <div className="map-container">
        <MapContainer
          center={initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter}
          zoom={initialLocation ? 13 : 6}
          style={{ height: '400px', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]} 
              icon={customIcon}
            >
              <Popup>
                <div>
                  <strong>Selected Location</strong>
                  <br />
                  Lat: {selectedLocation.lat.toFixed(6)}
                  <br />
                  Lng: {selectedLocation.lng.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="coordinates-display">
          <strong>Selected Coordinates:</strong>
          <div className="coordinate-values">
            <span>Latitude: {selectedLocation.lat.toFixed(6)}</span>
            <span>Longitude: {selectedLocation.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      <div className="map-instructions">
        <p>💡 Click anywhere on the map to select a location</p>
      </div>
    </div>
  );
};

export default MapPicker;