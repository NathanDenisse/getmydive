"use client";

import Image from "next/image";
import Map from "./Map";
import ExperienceCard from "@/components/ExperienceCard";
import { useRef, useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import ImageGallery from "./ImageGallery";
import { FaStar, FaMapMarkerAlt, FaSchool } from "react-icons/fa";

type Props = {
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  coords: [number, number];
  experiences: any[];
  instructors: {
    name: string;
    experience: string;
    speciality: string;
    bio: string;
    image: string;
  }[];
  rating: number;
  reviews: {
    author: string;
    comment: string;
    rating: number;
  }[];
  trainingSchool: string;
};

export default function ClubDetails({
  name,
  country,
  location,
  description,
  image,
  coords,
  experiences,
  instructors,
  rating,
  reviews,
  trainingSchool,
}: Props) {
  const expSectionRef = useRef<HTMLElement>(null);
  const [isExpVisible, setIsExpVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const observer = new window.IntersectionObserver(
        ([entry]) => setIsExpVisible(entry.isIntersecting),
        { threshold: 0.2 }
      );
      if (expSectionRef.current) {
        observer.observe(expSectionRef.current);
      }
      return () => observer.disconnect();
    }
  }, []);

  // Créer un tableau d'images pour la galerie
  const galleryImages = [
    image,
    // Ajouter des images supplémentaires basées sur le nom du club
    `/club-${name.toLowerCase().replace(/\s+/g, '-')}-2.jpg`,
    `/club-${name.toLowerCase().replace(/\s+/g, '-')}-3.jpg`,
  ].filter(Boolean);

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

      <div className="details-info">
        <div className="meta-item">
          <FaMapMarkerAlt className="meta-icon" />
          <div className="meta-text">
            <div className="meta-label">Localisation</div>
            <div className="meta-value">{location}</div>
          </div>
        </div>

        <div className="meta-item">
          <FaSchool className="meta-icon" />
          <div className="meta-text">
            <div className="meta-label">École de formation</div>
            <div className="meta-value">{trainingSchool}</div>
          </div>
        </div>

        <div className="meta-item">
          <FaStar className="meta-icon" />
          <div className="meta-text">
            <div className="meta-label">Note</div>
            <div className="meta-value">{rating}/5</div>
          </div>
        </div>
      </div>

      <div className="details-description">
        <p>{description}</p>
      </div>

      {/* Instructeurs */}
      <section className="instructors-section">
        <h2 className="section-title">Nos instructeurs</h2>
        <div className="instructors-grid">
          {instructors.map((instructor, index) => (
            <div key={index} className="instructor-card">
              <Image
                src={instructor.image}
                alt={instructor.name}
                width={80}
                height={80}
                className="instructor-photo"
              />
              <div className="instructor-info">
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-speciality">{instructor.speciality}</p>
                <p className="instructor-experience">{instructor.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expériences */}
      <section className="experiences-section" ref={expSectionRef}>
        <h2 className="section-title">Nos expériences</h2>
        <div className="experiences-grid">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </div>
      </section>

      {!isExpVisible && (
        <button
          className="floating-map-btn"
          onClick={() => {
            expSectionRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Voir les expériences"
        >
          <FiStar style={{ fontSize: 22, marginRight: 6 }} />
          Voir les expériences
        </button>
      )}

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
    </main>
  );
}
