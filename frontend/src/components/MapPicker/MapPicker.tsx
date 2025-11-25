// MapPicker/MapPicker.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix for default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to center map on user's location
function CenterMap({ location }: { location: { lat: number; lng: number } }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([location.lat, location.lng], 13);
  }, [location, map]);
  
  return null;
}

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(location);
        onLocationSelect(location.lat, location.lng);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = "Couldn't get your location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Unknown error.";
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        
        // Fallback to a default location (center of the world)
        const defaultLocation = { lat: 20, lng: 0 };
        setUserLocation(defaultLocation);
        onLocationSelect(defaultLocation.lat, defaultLocation.lng);
      },
      {
        enableHighAccuracy: false, // Keep it simple, no need for high accuracy
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [onLocationSelect]);

  if (isLoading) {
    return (
      <div className="map-container simple-map">
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Finding your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-map-container">
      {error && (
        <div className="map-error">
          ⚠️ {error}
        </div>
      )}
      
      <div className="map-container simple-map">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          worldCopyJump={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userLocation && (
            <>
              <CenterMap location={userLocation} />
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <strong>You are here!</strong>
                  <br />
                  Latitude: {userLocation.lat.toFixed(4)}
                  <br />
                  Longitude: {userLocation.lng.toFixed(4)}
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
      
      {userLocation && (
        <div className="location-info">
          <span className="location-pin">📍</span>
          <span>
            Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MapPicker;