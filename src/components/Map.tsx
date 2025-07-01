"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

// Fix bug d'icône manquante
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Marker = {
  position: [number, number];
  label: string;
};

type MapProps = {
  center: [number, number];
  markers: Marker[];
  zoom?: number;
};

const Map = ({ center, markers, zoom = 13 }: MapProps) => {
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);

  console.log('Map props:', { center, markers, zoom });

  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

      console.log('Leaflet components loaded');

      setMapContainer(MapContainer);
      setTileLayer(TileLayer);
      setMarker(Marker);
      setPopup(Popup);
    };

    loadLeaflet();
  }, []);

  if (!MapContainer || !TileLayer || !Marker || !Popup) {
    console.log('Waiting for Leaflet components to load...');
    return <div>Chargement de la carte...</div>;
  }

  console.log('Rendering map with markers:', markers);

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
