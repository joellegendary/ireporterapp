import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

// Fix marker icons for localhost (important!)
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onSelect?: (coords: { lat: number; lng: number }) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onSelect }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Stable map center (Kampala, Uganda)
    const map = L.map(mapRef.current).setView([0.3476, 32.5825], 13);
    mapInstance.current = map;

    // Reliable OpenStreetMap server - best for localhost
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap Contributors",
    }).addTo(map);

    // Click to place marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
          map
        );

        markerRef.current.on("dragend", () => {
          const pos = markerRef.current!.getLatLng();
          setCoords({ lat: pos.lat, lng: pos.lng });
          onSelect?.({ lat: pos.lat, lng: pos.lng });
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      onSelect?.({ lat, lng });
    });
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "380px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      ></div>

      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        {coords ? (
          <>
            <strong>Lat:</strong> {coords.lat.toFixed(6)} &nbsp;
            <strong>Lng:</strong> {coords.lng.toFixed(6)}
          </>
        ) : (
          <span style={{ color: "#888" }}>
            Click on the map to select location
          </span>
        )}
      </div>
    </div>
  );
};

export default MapPicker;
