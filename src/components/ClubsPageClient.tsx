"use client";
import { useState, useMemo } from "react";
import ClubCard from "@/components/ClubCard";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";

type Club = {
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  coords: [number, number];
  trainingSchool: string;
  activity: string;
  price: string;
  rating: number;
  reviews: any[];
  instructors: any[];
  experiences: any[];
};

type Props = {
  clubs: Club[];
};

const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

export default function ClubsPageClient({ clubs }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    trainingSchool: "",
    activity: "",
    priceRange: ""
  });

  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      const hasValidCoords = Array.isArray(club.coords) && club.coords.length === 2 &&
        typeof club.coords[0] === 'number' && typeof club.coords[1] === 'number';
      const matchesSearch =
        searchQuery === "" ||
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters =
        (!filters.country || club.country === filters.country) &&
        (!filters.trainingSchool || club.trainingSchool === filters.trainingSchool) &&
        (!filters.activity || club.activity === filters.activity) &&
        (!filters.priceRange || club.price === filters.priceRange);
      return hasValidCoords && matchesSearch && matchesFilters;
    });
  }, [clubs, filters, searchQuery]);

  const mapCenter: [number, number] = [20.422983, -86.922343];
  const mapMarkers = filteredClubs
    .filter(club => Array.isArray(club.coords) && club.coords.length === 2 && typeof club.coords[0] === 'number' && typeof club.coords[1] === 'number')
    .map((club) => ({
      position: club.coords,
      label: club.name,
    }));

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-12">
        <h1 className="section-title text-center mb-8">Clubs de Plongée</h1>
        <SearchBar
          onSearch={setSearchQuery}
          onFilter={setFilters}
        />
        <div className="clubs-grid">
          {filteredClubs.map((club) => (
            <ClubCard key={club.slug} {...club} />
          ))}
        </div>
        <div className="mt-12">
          <MapSection center={mapCenter} markers={mapMarkers} />
        </div>
      </main>
    </div>
  );
} 