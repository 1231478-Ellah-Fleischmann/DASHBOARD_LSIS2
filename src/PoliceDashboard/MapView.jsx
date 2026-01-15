import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatTime, riskLabel } from "./utils";

// Fix do ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
}

export default function MapView({ selected }) {
  const center = [selected?.lat ?? 41.1579, selected?.lng ?? -8.6291];

  return (
    <main style={{ padding: 12 }}>
      <div
        style={{
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <Recenter lat={selected?.lat} lng={selected?.lng} />

          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selected && (
            <Marker position={[selected.lat, selected.lng]}>
              <Popup>
                <div style={{ fontWeight: 700 }}>{selected.id}</div>
                <div>{selected.victimName}</div>
                <div>Risco: {riskLabel(selected.risk)}</div>
                <div>Estado: {selected.status}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(selected.lastUpdateAt)}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </main>
  );
}