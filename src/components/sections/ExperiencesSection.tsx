"use client";

import Link from "next/link";
import ExperienceCard from "@/components/ExperienceCard";

type Experience = {
  slug: string;
  title: string;
  description: string;
  image: string;
  animals: string[];
  level: string;
  price: string;
  rating: number;
  clubSlug: string;
  clubName: string;
};

type Props = {
  experiences: Experience[];
};

export default function ExperiencesSection({ experiences }: Props) {
  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2 className="section-title">Expériences de plongée</h2>
        <Link href="/experiences" className="section-link">Voir toutes les expériences</Link>
      </div>
      <div className="horizontal-scroll-container">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} {...experience} />
        ))}
      </div>
    </section>
  );
} 