"use client";
import { useState, useMemo, useReducer, useEffect, useCallback, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import debounce from "lodash/debounce";
import { FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SearchBar from "@/components/SearchBar";
import SpotCard from "@/components/SpotCard";
import ClubCard from "@/components/ClubCard";
import ExperienceCard from "@/components/ExperienceCard";
import clubs from "@/data/clubs.json";
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSearch } from '../hooks/useSearch';
import { useFilters } from '../hooks/useFilters';
import { CACHE_KEYS, MAP_DEFAULTS } from '../constants';
import type { Spot } from '../types';
import { getSpotDistance, formatDistance } from '../utils/helpers';

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const SpotsSection = dynamic(() => import("@/components/sections/SpotsSection"), { ssr: true });
const ClubsSection = dynamic(() => import("@/components/sections/ClubsSection"), { ssr: true });
const ExperiencesSection = dynamic(() => import("@/components/sections/ExperiencesSection"), { ssr: true });
const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

const EXAMPLE_SLUGS = [
  'tulum',
  'komodo',
  'blue-hole',
  'cozumel',
  'nusa-penida',
  'great-barrier-reef',
  'galapagos',
  'sipadan',
  'red-sea',
  'silfra',
];

type Props = {
  spots: Spot[];
  total: number;
};

type FilterState = {
  activity: string;
  level: string;
  priceRange: string;
  animals: string;
};

type FilterAction = {
  type: 'SET_FILTER';
  field: keyof FilterState;
  value: string;
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

function normalizeSlug(slug: string) {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '');
}

function getExampleSpots(spots: Spot[]) {
  const normalizedExamples = EXAMPLE_SLUGS.map(normalizeSlug);
  return spots.filter(spot => normalizedExamples.includes(normalizeSlug(spot.slug)));
}

const PREVIEW_COUNT = 10;

// Liste d'images aléatoires pour les spots
const RANDOM_SPOT_IMAGES = [
  '/blue-hole.jpg',
  '/club-bali.jpg',
  '/club-blue.jpg',
  '/club-dive-kingdom.jpg',
  '/club-oceanic.jpg',
  '/club-reef.jpg',
  '/cozumel.jpg',
  '/experience-autonomy.jpg',
  '/experience-cenote.jpg',
  '/experience-discovery.jpg',
  '/experience-drift.jpg',
  '/experience-manta.jpg',
  '/fish.jpg',
  '/galapagos.jpg',
  '/great-barrier-reef.jpg',
  '/komodo.jpg',
  '/manta.jpg',
  '/manta2.jpg',
  '/red-sea.jpg',
  '/silfra.jpg',
  '/sipadan.jpg',
  '/spots-nusa-penida.jpg',
  '/tulum-2.jpg',
  '/tulum.jpg',
  '/wreck.jpg',
];

// Étendre le type Spot localement pour inclure randomImage
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

export default function HomeClient({ spots, total }: Props) {
  const [showMap, setShowMap] = useLocalStorage<boolean>(CACHE_KEYS.SHOW_MAP, true);
  const { query, filteredSpots, handleSearch, clearSearch } = useSearch(spots);
  const { filters, setFilter, resetFilters } = useFilters();
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  // Références pour les carrousels
  const spotsCarouselRef = useRef<HTMLDivElement>(null);
  const clubsCarouselRef = useRef<HTMLDivElement>(null);
  const experiencesCarouselRef = useRef<HTMLDivElement>(null);

  // Observer pour détecter quand la carte est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMapVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Observer pour gérer l'effet d'ombre sur la dernière carte visible
  useEffect(() => {
    const carousels = [spotsCarouselRef, clubsCarouselRef, experiencesCarouselRef];

    const observers = carousels.map(ref => {
      if (!ref.current) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const lastItem = entry.target.querySelector('.carousel-item:last-child');
            if (lastItem) {
              if (entry.isIntersecting) {
                lastItem.classList.add('fully-visible');
              } else {
                lastItem.classList.remove('fully-visible');
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  // Fonction pour faire défiler vers la carte
  const scrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtrage des spots en fonction des filtres
  const filteredSpotsWithFilters = filteredSpots.filter(spot => {
    if (!spot) return false;
    if (filters.activity && spot.activity !== filters.activity) return false;
    if (filters.level && spot.level !== filters.level) return false;
    if (filters.priceRange && spot.price !== filters.priceRange) return false;
    if (filters.animals && !spot.animals?.includes(filters.animals)) return false;
    return true;
  });

  // Remplacer previewSpots par une version avec images aléatoires
  const previewSpots = useMemo(() =>
    assignRandomImagesDeterministic(filteredSpotsWithFilters.slice(0, PREVIEW_COUNT), RANDOM_SPOT_IMAGES),
    [filteredSpotsWithFilters]
  );

  // Prévisualisation des clubs
  const previewClubs = useMemo(() =>
    clubs.slice(0, PREVIEW_COUNT),
    [clubs]
  );

  // Prévisualisation des expériences
  const previewExperiences = useMemo(() =>
    clubs.flatMap(club =>
      (club.experiences || []).map(exp => ({
        ...exp,
        clubSlug: club.slug,
        clubName: club.name
      }))
    ).slice(0, PREVIEW_COUNT),
    [clubs]
  );

  const handleFilterChange = (newFilters: FilterState) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key as keyof FilterState, value);
    });
  };

  if (!spots || spots.length === 0) {
    return (
      <div className="no-results">
        <h2>Aucun spot disponible</h2>
        <p>Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <main className="home-container">
      {/* En-tête */}
      <header className="home-header">
        <h1 className="home-title">Bienvenue sur GetMyDive 🌊</h1>
        <p className="home-subtitle">Découvrez les meilleurs spots de plongée du monde</p>
      </header>

      {/* Barre de recherche et filtres */}
      <section className="search-section">
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilterChange}
        />
      </section>

      {/* Carrousel des spots */}
      <section className="carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">Spots populaires</h2>
          <Link href="/spots" className="view-all-button">
            Voir tous les spots
            <FiChevronRight />
          </Link>
        </div>
        <div className="carousel-container" ref={spotsCarouselRef}>
          {previewSpots.map((spot) => (
            <div key={spot.slug} className="carousel-item">
              <SpotCard spot={spot} randomImage={(spot as SpotWithRandomImage).randomImage} />
            </div>
          ))}
        </div>
      </section>

      {/* Carrousel des clubs */}
      <section className="carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">Clubs de plongée</h2>
          <Link href="/clubs" className="view-all-button">
            Voir tous les clubs
            <FiChevronRight />
          </Link>
        </div>
        <div className="carousel-container" ref={clubsCarouselRef}>
          {previewClubs.map((club) => (
            <div key={club.slug} className="carousel-item">
              <ClubCard {...club} />
            </div>
          ))}
        </div>
      </section>

      {/* Carrousel des expériences */}
      <section className="carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">Expériences de plongée</h2>
          <Link href="/experiences" className="view-all-button">
            Voir toutes les expériences
            <FiChevronRight />
          </Link>
        </div>
        <div className="carousel-container" ref={experiencesCarouselRef}>
          {previewExperiences.map((exp, index) => (
            <div key={index} className="carousel-item">
              <ExperienceCard {...exp} />
            </div>
          ))}
        </div>
      </section>

      {/* Carte */}
      <section className="map-section" ref={mapSectionRef}>
        <div className="map-container">
          <Map
            center={[20.422983, -86.922343]}
            zoom={4}
            markers={spots
              .filter(spot => Array.isArray(spot.coords) && spot.coords.length === 2 && typeof spot.coords[0] === 'number' && typeof spot.coords[1] === 'number')
              .map((spot) => ({
                position: spot.coords,
                label: spot.name,
              }))
            }
          />
        </div>
      </section>

      {/* Bouton flottant pour la carte */}
      {!isMapVisible && (
        <button
          className="floating-map-button"
          onClick={scrollToMap}
          type="button"
          aria-label="Afficher la carte"
        >
          <FiMapPin style={{ fontSize: 18, marginRight: 6 }} />
          <span style={{ flex: 1, textAlign: 'center' }}>Carte</span>
        </button>
      )}
    </main>
  );
} 