"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
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

export default function ExperienceCard({
  slug,
  title,
  description,
  image,
  animals,
  level,
  price,
  rating,
  clubSlug,
  clubName,
}: Props) {
  const shortDesc = description.length > 80 ? description.slice(0, 80) + "..." : description;

  return (
    <Link href={`/experiences/${slug}`} className="experience-card-link">
      <div className="experience-card-image-container">
        <Image src={image} alt={title} fill className="experience-card-image" priority />
      </div>
      <div className="experience-card-content">
        <div className="experience-card-header">
          <h3 className="experience-card-title">{title}</h3>
          <span className="experience-card-rating">⭐️ {rating.toFixed(1)}</span>
        </div>
        <p className="experience-card-desc ellipsis-2l">{shortDesc}</p>
        <div className="experience-card-meta">
          <span className="experience-card-badge">{level}</span>
          <span className="experience-card-badge">{price}</span>
        </div>
        <div className="experience-card-animals">
          {animals.slice(0, 3).map((animal, index) => (
            <span key={index} className="experience-animal-badge">{animal}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
