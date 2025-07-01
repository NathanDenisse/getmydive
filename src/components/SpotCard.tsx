"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin } from 'react-icons/fi';
import type { Spot } from '../types';

type Props = {
  spot: Spot;
  randomImage?: string;
};

export default function SpotCard({ spot, randomImage }: Props) {
  if (!spot) return null;

  const {
    slug,
    name,
    country,
    description,
    image,
    animals,
  } = spot;

  return (
    <Link href={`/spots/${slug}`} className="spot-card-link">
      <div className="spot-card-image-container">
        <Image
          src={image || randomImage || '/images/default-spot.jpg'}
          alt={name}
          fill
          className="spot-card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="spot-card-content">
        <div className="spot-card-header">
          <h3 className="spot-card-title">{name}</h3>
          <span className="spot-card-country">
            <FiMapPin className="spot-card-icon" />
            {country}
          </span>
        </div>
        <p className="spot-card-desc ellipsis-2l">{description}</p>
        <div className="spot-card-animals">
          {animals?.slice(0, 3).map((animal, i) => (
            <span key={i} className="spot-animal-badge">{animal}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
