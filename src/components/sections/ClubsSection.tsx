"use client";

import Link from "next/link";
import ClubCard from "@/components/ClubCard";

type Club = {
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  trainingSchool: string;
  rating: number;
};

type Props = {
  clubs: Club[];
};

export default function ClubsSection({ clubs }: Props) {
  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2 className="section-title">Clubs de plongée</h2>
        <Link href="/clubs" className="section-link">Voir tous les clubs</Link>
      </div>
      <div className="horizontal-scroll-container">
        {clubs.map((club) => (
          <ClubCard key={club.slug} {...club} />
        ))}
      </div>
    </section>
  );
} 