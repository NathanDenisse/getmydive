"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div>Chargement de la carte...</div>,
});

type Marker = {
  position: [number, number];
  label: string;
};

type MapSectionProps = {
  center: [number, number];
  markers: Marker[];
  zoom?: number;
};

export default function MapSection({ center, markers, zoom = 4 }: MapSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  console.log('MapSection props:', { center, markers, zoom });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    console.log('MapSection not mounted yet');
    return null;
  }

  console.log('Rendering MapSection with markers:', markers);

  return (
    <section className="map-section">
      <div className="container">
        <h2>Localisation</h2>
        <Map center={center} markers={markers} zoom={zoom} />
      </div>
    </section>
  );
} 