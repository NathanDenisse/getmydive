"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Marker = {
  position: [number, number];
  label: string;
};

type MapProps = {
  center: [number, number];
  markers: Marker[];
  zoom?: number;
};

// Composant Map interne qui utilise Leaflet
const MapComponent = ({ center, markers, zoom = 13 }: MapProps) => {
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Import dynamique de Leaflet
        const L = await import("leaflet");
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

        // Le CSS de Leaflet sera chargé via le fichier global

        // Fix bug d'icône manquante
        delete (L.Icon.Default as any).prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        setMapContainer(MapContainer);
        setTileLayer(TileLayer);
        setMarker(Marker);
        setPopup(Popup);
      } catch (error) {
        console.error('Erreur lors du chargement de Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  if (!MapContainer || !TileLayer || !Marker || !Popup) {
    return <div>Chargement de la carte...</div>;
  }

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

// Composant Map principal avec chargement dynamique
const Map = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => <div>Chargement de la carte...</div>
});

export default Map;
