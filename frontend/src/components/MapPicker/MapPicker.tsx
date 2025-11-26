// MapPicker/MapPicker.tsx
import React, { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPicker.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  onSelect: (coords: { lat: number; lng: number }) => void;
}

// Exact coordinates from the Google Maps link - Maganjo area, Kampala
const MAGANJO_LOCATION: [number, number] = [0.394722, 32.551111];

function MapClickHandler({
  onSelect,
}: {
  onSelect: (coords: { lat: number; lng: number }) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      markerRef.current = L.marker([lat, lng])
        .addTo(e.target)
        .bindPopup(`Selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        .openPopup();

      // Call parent callback
      onSelect({ lat, lng });
    },
  });

  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ onSelect }) => {
  const mapRef = useRef<L.Map>(null);

  return (
    <div className="map-picker-container">
      <MapContainer
        center={MAGANJO_LOCATION}
        zoom={16}
        style={{ height: "400px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Static marker for Maganjo reference */}
        <Marker position={MAGANJO_LOCATION}>
          <Popup>
            <strong>Maganjo Area</strong>
            <br />
            {MAGANJO_LOCATION[0].toFixed(6)}°N, {MAGANJO_LOCATION[1].toFixed(6)}
            °E
            <br />
            <em>Kawempe Division, Kampala</em>
          </Popup>
        </Marker>

        <MapClickHandler onSelect={onSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
