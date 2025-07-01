"use client";
import { useState, useMemo } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";

type Experience = {
  slug: string;
  title: string;
  description: string;
  price: string;
  level: string;
  activity: string;
  animals: string[];
  image: string;
  rating: number;
  coords: [number, number];
  clubSlug: string;
  clubName: string;
};

type Props = {
  experiences: Experience[];
};

const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

export default function ExperiencesPageClient({ experiences }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    activity: "",
    priceRange: "",
    animals: ""
  });

  const filteredExperiences = useMemo(() => {
    return experiences.filter(exp => {
      const matchesSearch =
        searchQuery === "" ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.clubName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters =
        (!filters.level || exp.level === filters.level) &&
        (!filters.activity || exp.activity === filters.activity) &&
        (!filters.priceRange || exp.price === filters.priceRange) &&
        (!filters.animals || exp.animals.includes(filters.animals));
      return matchesSearch && matchesFilters;
    });
  }, [experiences, filters, searchQuery]);

  const mapCenter: [number, number] = [20.422983, -86.922343];
  const mapMarkers = filteredExperiences.map((exp) => ({
    position: exp.coords,
    label: exp.title,
  }));

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-12">
        <h1 className="section-title text-center mb-8">Expériences de plongée</h1>
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            onFilter={setFilters}
          />
        </div>
        <div className="experiences-grid">
          {filteredExperiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />
          ))}
        </div>
        <div className="mt-12">
          <MapSection center={mapCenter} markers={mapMarkers} />
        </div>
      </main>
    </div>
  );
} 