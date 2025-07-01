"use client";

import Link from "next/link";
import SpotCard from "@/components/SpotCard";

type Spot = {
  slug: string;
  name: string;
  country: string;
  description: string;
  image: string;
  coords: [number, number];
  animals: string[];
  level: string;
  activity: string;
  price: string;
  temperature: number;
  visibility: number;
  current: string;
  depthRange: string;
  bestSeason: string;
  category: string;
};

type Props = {
  spots: Spot[];
};

export default function SpotsSection({ spots }: Props) {
  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2 className="section-title">Spots de plongée</h2>
        <Link href="/spots" className="section-link">Voir tous les spots</Link>
      </div>
      <div className="horizontal-scroll-container">
        {spots.map((spot) => (
          <SpotCard key={spot.slug} {...spot} coords={spot.coords} />
        ))}
      </div>
    </section>
  );
} 