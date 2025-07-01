"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  trainingSchool: string;
  rating: number;
};

export default function ClubCard({
  slug,
  name,
  country,
  location,
  description,
  image,
  trainingSchool,
  rating,
}: Props) {
  const shortDesc = description.length > 80 ? description.slice(0, 80) + "..." : description;

  return (
    <Link href={`/clubs/${slug}`} className="experience-card-link">
      <div className="experience-card-image-container">
        <Image src={image} alt={name} fill className="experience-card-image" />
      </div>
      <div className="experience-card-content">
        <div className="experience-card-header">
          <h3 className="experience-card-title">{name}</h3>
          <span className="experience-card-rating">⭐️ {rating.toFixed(1)}</span>
        </div>
        <div className="experience-card-meta">
          <span className="experience-card-location">{location}, {country}</span>
          <span className="experience-card-badge">{trainingSchool}</span>
        </div>
        <p className="experience-card-desc ellipsis-2l">{shortDesc}</p>
      </div>
    </Link>
  );
}
