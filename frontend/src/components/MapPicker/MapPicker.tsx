import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number } | null;
}

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Move the map when coordinates change
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  map.setView([lat, lng]);
  return null;
};

const LocationEvents = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation ?? null);

  // Detect location only on first load if no initial location provided
  useEffect(() => {
    if (!selectedLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setSelectedLocation({ lat, lng });
            onLocationSelect(lat, lng);
          },
          () => {
            // fallback to Kampala center
            const fallback = { lat: 0.3476, lng: 32.5825 };
            setSelectedLocation(fallback);
            onLocationSelect(fallback.lat, fallback.lng);
          }
        );
      }
    }
  }, [selectedLocation, onLocationSelect]);

  const handleSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSelect(pos.coords.latitude, pos.coords.longitude),
      () => alert("Could not get your location")
    );
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button onClick={getCurrentLocation} className="btn btn-secondary">
        📍 Use My Location
      </button>

      {selectedLocation ? (
        <>
          <MapContainer
            center={selectedLocation}
            zoom={14}
            style={{ height: "350px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <RecenterMap
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
            />
            <LocationEvents onSelect={handleSelect} />

            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          </MapContainer>

          <div>
            <strong>Selected Coordinates:</strong>
            <br />
            Latitude: {selectedLocation.lat.toFixed(6)}
            <br />
            Longitude: {selectedLocation.lng.toFixed(6)}
          </div>
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapPicker;
