"use client";

import Image from "next/image";
import Map from "./Map";
import ImageGallery from "./ImageGallery";
import { FaStar, FaSwimmer, FaEuroSign } from "react-icons/fa";

type Props = {
  title: string;
  description: string;
  image: string;
  coords: [number, number];
  price: number;
  duration: string;
  level: string;
  maxDepth: number;
  temperature: number;
  visibility: number;
  included: string[];
  requirements: string[];
  schedule: {
    day: string;
    time: string;
  }[];
  reviews: {
    author: string;
    comment: string;
    rating: number;
  }[];
  animals: string[];
  clubName: string;
};

export default function ExperienceDetails({
  title,
  description,
  image,
  coords,
  price,
  duration,
  level,
  maxDepth,
  temperature,
  visibility,
  included = [],
  requirements = [],
  schedule = [],
  reviews = [],
  animals,
  clubName,
}: Props) {
  // Créer un tableau d'images pour la galerie
  const galleryImages = [
    image,
    // Ajouter des images supplémentaires basées sur le titre de l'expérience
    `/experience-${title.toLowerCase().replace(/\s+/g, '-')}-2.jpg`,
    `/experience-${title.toLowerCase().replace(/\s+/g, '-')}-3.jpg`,
  ].filter(Boolean);

  return (
    <main className="details-page">
      <div className="details-header">
        <h1 className="details-title">{title}</h1>
        <p className="details-subtitle">{duration} • Niveau {level} • {clubName}</p>
      </div>

      <div className="details-grid details-grid--media">
        <div className="details-image-container details-media-block">
          <ImageGallery images={galleryImages} title={title} />
        </div>

        <div className="details-map-container details-media-block">
          <Map
            center={coords}
            zoom={8}
            markers={[{ position: coords, label: title }]}
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
              <div className="meta-label">Niveau</div>
              <div className="meta-value">{level}</div>
            </div>
          </div>
          <div className="meta-item">
            <FaEuroSign className="meta-icon" />
            <div className="meta-text">
              <div className="meta-label">Prix</div>
              <div className="meta-value">{price}€</div>
            </div>
          </div>
          <div className="meta-item">
            <div className="meta-text">
              <div className="meta-label">Profondeur max</div>
              <div className="meta-value">{maxDepth}m</div>
            </div>
          </div>
          <div className="meta-item">
            <div className="meta-text">
              <div className="meta-label">Température</div>
              <div className="meta-value">{temperature}°C</div>
            </div>
          </div>
          <div className="meta-item">
            <div className="meta-text">
              <div className="meta-label">Visibilité</div>
              <div className="meta-value">{visibility}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclus et Prérequis */}
      <div className="details-grid">
        <section className="details-section">
          <h2 className="section-title">Ce qui est inclus</h2>
          <ul className="details-list">
            {included.map((item, index) => (
              <li key={index} className="details-list-item">
                <span className="check-icon">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="details-section">
          <h2 className="section-title">Prérequis</h2>
          <ul className="details-list">
            {requirements.map((item, index) => (
              <li key={index} className="details-list-item">
                <span className="check-icon">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Planning */}
      <section className="schedule-section">
        <h2 className="section-title">Planning</h2>
        <div className="schedule-grid">
          {schedule.map((slot, index) => (
            <div key={index} className="schedule-card">
              <div className="schedule-day">{slot.day}</div>
              <div className="schedule-time">{slot.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Avis */}
      {reviews?.length > 0 && (
        <section className="reviews-section">
          <h2 className="section-title">Avis clients</h2>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <span className="review-author">{review.author}</span>
                  <span className="review-rating">⭐️ {review.rating}/5</span>
                </div>
                <p className="review-content">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="details-animals">
        <h2 className="section-title">Animaux observables</h2>
        <div className="badge-container">
          {animals.map((animal, index) => (
            <span key={index} className="animal-badge">
              {animal}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
