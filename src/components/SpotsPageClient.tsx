"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";

const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

import SearchBar from "@/components/SearchBar";
import { Spot } from '@/scripts/types';

const SPOTS_PER_PAGE = 40;
const CAROUSEL_SIZE = 10;
const CAROUSEL_COUNT = 4;

// Liste d'images aléatoires pour les spots (même que HomeClient)
const RANDOM_SPOT_IMAGES = [
  '/blue-hole.jpg', '/club-bali.jpg', '/club-blue.jpg', '/club-dive-kingdom.jpg', '/club-oceanic.jpg', '/club-reef.jpg', '/cozumel.jpg', '/experience-autonomy.jpg', '/experience-cenote.jpg', '/experience-discovery.jpg', '/experience-drift.jpg', '/experience-manta.jpg', '/fish.jpg', '/galapagos.jpg', '/great-barrier-reef.jpg', '/komodo.jpg', '/manta.jpg', '/manta2.jpg', '/red-sea.jpg', '/silfra.jpg', '/sipadan.jpg', '/spots-nusa-penida.jpg', '/tulum-2.jpg', '/tulum.jpg', '/wreck.jpg'
];

interface SpotWithRandomImage extends Spot {
  randomImage?: string;
}

// Fonction de hash simple (djb2)
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function assignRandomImagesDeterministic(spots: Spot[], images: string[]): SpotWithRandomImage[] {
  return spots.map((spot) => {
    if (spot.image) return { ...spot, randomImage: undefined };
    const idx = hashString(spot.slug || spot.name || Math.random().toString()) % images.length;
    return { ...spot, randomImage: images[idx] };
  });
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function getUserCountry(spots: Spot[]): string | null {
  // Logique pour détecter le pays de l'utilisateur
  return null;
}

type Props = {
  spots: Spot[];
  currentPage: number;
  totalPages: number;
  allSpots?: Spot[];
};

export default function SpotsPageClient({ spots, currentPage, totalPages, allSpots }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [activeCarousel, setActiveCarousel] = useState<number | null>(null);

  // Détection du pays utilisateur au chargement
  useEffect(() => {
    setUserCountry(getUserCountry(allSpots || spots));
  }, [allSpots, spots]);

  // Filtrage intelligent
  const filteredSpots = useMemo(() => {
    if (!searchQuery) return allSpots || spots;
    const q = searchQuery.toLowerCase();
    return (allSpots || spots).filter(spot =>
      spot.name.toLowerCase().includes(q) ||
      spot.country.toLowerCase().includes(q) ||
      (spot.location || '').toLowerCase().includes(q) ||
      (spot.description || '').toLowerCase().includes(q)
    );
  }, [searchQuery, allSpots, spots]);

  // Groupement par pays
  const spotsByCountry = useMemo(() => {
    const grouped: Record<string, Spot[]> = {};
    for (const spot of filteredSpots) {
      if (!spot.country) continue;
      if (!grouped[spot.country]) grouped[spot.country] = [];
      grouped[spot.country].push(spot);
    }
    return grouped;
  }, [filteredSpots]);

  // Liste des pays triée alpha, mais pays utilisateur en premier
  const countryList = useMemo(() => {
    const allCountries = Object.keys(spotsByCountry).sort((a, b) => a.localeCompare(b));
    if (userCountry && allCountries.includes(userCountry)) {
      return [userCountry, ...allCountries.filter(c => c !== userCountry)];
    }
    return allCountries;
  }, [spotsByCountry, userCountry]);

  // Refs pour chaque carrousel
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollCarousel = (idx: number, direction: 'left' | 'right') => {
    const ref = carouselRefs.current[idx];
    if (ref) {
      const scrollAmount = ref.offsetWidth * 0.8;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-12">
        <h1 className="section-title text-center mb-8">Spots de plongée</h1>
        <SearchBar
          onSearch={setSearchQuery}
          onFilter={() => { }}
        />
        <div className="mb-8 flex justify-center">
          <button className="btn btn-primary" onClick={() => setShowMap(m => !m)}>
            {showMap ? "Masquer la carte" : "Afficher la carte"}
          </button>
        </div>

        {countryList.map((country, idx) => {
          const countrySpots = assignRandomImagesDeterministic(spotsByCountry[country].sort((a, b) => a.name.localeCompare(b.name)), RANDOM_SPOT_IMAGES);
          return (
            <div
              key={country}
              className="carousel-section mb-16"
              onMouseEnter={() => setActiveCarousel(idx)}
              onMouseLeave={() => setActiveCarousel(null)}
            >
              <div className="carousel-header">
                <h2 className="carousel-title">{country}</h2>
                <div className="carousel-controls">
                  <button
                    className="carousel-control-btn"
                    onClick={() => scrollCarousel(idx, 'left')}
                    aria-label="Défiler à gauche"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    className="carousel-control-btn"
                    onClick={() => scrollCarousel(idx, 'right')}
                    aria-label="Défiler à droite"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
              <div
                ref={el => { carouselRefs.current[idx] = el; }}
                className="carousel-container"
              >
                {countrySpots.map((spot) => (
                  <div key={spot.slug} className="carousel-item">
                    <Link href={`/spots/${spot.slug}`} className="spot-card-link">
                      <div className="spot-card-image-container">
                        <Image
                          src={spot.image || (spot as SpotWithRandomImage).randomImage || '/images/default-spot.jpg'}
                          alt={spot.name}
                          fill
                          className="spot-card-image"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="spot-card-content">
                        <div className="spot-card-header">
                          <h3 className="spot-card-title">{spot.name}</h3>
                          <span className="spot-card-country">
                            <FiMapPin className="spot-card-icon" />
                            {spot.country}
                          </span>
                        </div>
                        <p className="spot-card-desc ellipsis-2l">{spot.description}</p>
                        <div className="spot-card-animals">
                          {spot.animals?.slice(0, 3).map((animal, i) => (
                            <span key={i} className="spot-animal-badge">{animal}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {showMap && (
          <div className="mb-12 mt-12">
            <MapSection
              center={[20.422983, -86.922343]}
              markers={filteredSpots
                .filter(spot => Array.isArray(spot.coords) && spot.coords[0] != null && spot.coords[1] != null)
                .map((spot) => ({
                  position: spot.coords,
                  label: spot.name,
                }))
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Ajout CSS pour le carrousel Netflix
// .carousel-scroll { scroll-snap-type: x mandatory; }
// .snap-start { scroll-snap-align: start; }
// .carousel-arrow { background: #fff; border: none; font-size: 2rem; margin: 0 0.5rem; cursor: pointer; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.2s; }
// .carousel-arrow:hover { background: #eaf6fb; } 