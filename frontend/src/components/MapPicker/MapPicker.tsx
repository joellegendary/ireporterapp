import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css"; // OPTION 2 — CSS imported here

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
}

// Fix marker icon paths (Leaflet default icons)
const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || null
  );

  const handleSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        handleSelect(lat, lng);
      },
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

      <MapContainer
        center={selectedLocation || { lat: 0, lng: 0 }}
        zoom={5}
        style={{ height: "350px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationEvents onSelect={handleSelect} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>

      {selectedLocation && (
        <div>
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
