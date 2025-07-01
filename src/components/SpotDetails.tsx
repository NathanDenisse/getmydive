"use client";

import ImageGallery from "./ImageGallery";
import Map from "./Map";
import { FaWater, FaTemperatureLow, FaEye, FaEuroSign, FaSwimmer } from "react-icons/fa";

type Props = {
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
  location: string;
};

export default function SpotDetails({
  name,
  country,
  description,
  image,
  coords,
  animals,
  level,
  activity,
  price,
  temperature,
  visibility,
  location,
}: Props) {
  // Créer un tableau d'images pour la galerie
  const galleryImages = [image];

  return (
    <main className="details-page">
      <div className="details-header">
        <h1 className="details-title">{name}</h1>
        <p className="details-subtitle">
          {location ? `${location}, ` : ''}{country}
        </p>
      </div>

      <div className="details-grid details-grid--media">
        <div className="details-image-container details-media-block">
          <ImageGallery images={galleryImages} title={name} />
        </div>

        <div className="details-map-container details-media-block">
          <Map
            center={coords}
            zoom={8}
            markers={[{ position: coords, label: name }]}
          />
        </div>
      </div>

      <div className="details-description">
        <p>{description}</p>
      </div>

      <div className="details-info">
        <div className="details-meta">
          <div className="meta-item">
            <FaSwimmer className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Activité</div>
              <div className="meta-value">{activity}</div>
            </div>
          </div>

          <div className="meta-item">
            <FaWater className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Niveau</div>
              <div className="meta-value">{level}</div>
            </div>
          </div>

          <div className="meta-item">
            <FaEuroSign className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Prix</div>
              <div className="meta-value">{price}</div>
            </div>
          </div>

          <div className="meta-item">
            <FaTemperatureLow className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Température</div>
              <div className="meta-value">{temperature}°C</div>
            </div>
          </div>

          <div className="meta-item">
            <FaEye className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Visibilité</div>
              <div className="meta-value">{visibility}m</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">Animaux observables</h2>
          <div className="badge-container">
            {animals.map((animal, index) => (
              <span key={index} className="animal-badge big-badge">
                {animal}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
