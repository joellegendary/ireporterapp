import React, { useState, useEffect } from 'react';
import './MapPicker.css';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  // In a real app, you would use the Google Maps JavaScript API
  // For now, we'll create a simulated map with click functionality
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to approximate coordinates
    // This is simplified - in real app, use Google Maps API
    const lat = -((y / rect.height) * 180 - 90);
    const lng = ((x / rect.width) * 360 - 180);
    
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
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
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
          className="btn btn-secondary"
          onClick={getCurrentLocation}
        >
          📍 Use My Location
        </button>
      </div>

      <div className="map-container" onClick={handleMapClick}>
        {/* Simulated Map - Replace with Google Maps in production */}
        <div className="simulated-map">
          <div className="map-grid">
            {Array.from({ length: 12 }).map((_, row) => (
              <div key={row} className="map-row">
                {Array.from({ length: 24 }).map((_, col) => (
                  <div key={col} className="map-cell" />
                ))}
              </div>
            ))}
          </div>
          
          {selectedLocation && (
            <div 
              className="map-marker"
              style={{
                left: `${(selectedLocation.lng + 180) / 360 * 100}%`,
                top: `${(-selectedLocation.lat + 90) / 180 * 100}%`
              }}
            >
              📍
            </div>
          )}
        </div>

        <div className="map-overlay-text">
          <p>Click on the map to select location</p>
          <small>In production: Google Maps would be integrated here</small>
        </div>
      </div>

      {selectedLocation && (
        <div className="coordinates-display">
          <strong>Selected Coordinates:</strong>
          <br />
          Latitude: {selectedLocation.lat.toFixed(6)}
          <br />
          Longitude: {selectedLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default MapPicker;