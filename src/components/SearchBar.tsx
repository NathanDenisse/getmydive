"use client";

import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useFilters } from '../hooks/useFilters';
import { ACTIVITIES, LEVELS, PRICE_RANGES, ANIMALS } from '../constants';
import type { FilterState } from '../hooks/useFilters';

type Props = {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
};

export default function SearchBar({ onSearch, onFilter }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const { filters, setFilter, resetFilters } = useFilters();

  const handleFilterClick = (type: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilter(type, value);
    onFilter(newFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    onFilter(filters);
  };

  return (
    <div className="searchbar-outer">
      <div className="searchbar-container">
        <div className="searchbar-input-group">
          <div className="searchbar-input-wrapper">
            <FiSearch className="searchbar-icon" />
            <input
              type="text"
              className="searchbar-input"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Rechercher un spot, un club ou une expérience..."
              style={{ paddingLeft: 40 }}
            />
          </div>
          <button
            className="filter-modal-btn"
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label="Filtres"
          >
            <FiFilter style={{ fontSize: 20, marginRight: 6 }} /> Filtres
          </button>
        </div>
        {showFilters && (
          <div className="filter-modal-overlay" onClick={() => setShowFilters(false)}>
            <div className="filter-modal" onClick={e => e.stopPropagation()}>
              <div className="filter-modal-header">
                <span>Filtres</span>
                <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                  <button className="filter-modal-reset" onClick={handleResetFilters} type="button">Réinitialiser</button>
                  <button className="filter-modal-close" onClick={() => setShowFilters(false)}>&times;</button>
                </div>
              </div>
              <div className="filter-modal-section">
                <div className="filter-modal-label">Activité</div>
                <div className="filter-modal-group">
                  {ACTIVITIES.map((activity) => (
                    <button
                      key={activity}
                      className={`filter-btn${filters.activity === activity ? " active" : ""}`}
                      onClick={() => handleFilterClick("activity", activity)}
                      type="button"
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-modal-section">
                <div className="filter-modal-label">Niveau</div>
                <div className="filter-modal-group">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      className={`filter-btn${filters.level === level ? " active" : ""}`}
                      onClick={() => handleFilterClick("level", level)}
                      type="button"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-modal-section">
                <div className="filter-modal-label">Prix</div>
                <div className="filter-modal-group">
                  {PRICE_RANGES.map((price) => (
                    <button
                      key={price}
                      className={`filter-btn${filters.priceRange === price ? " active" : ""}`}
                      onClick={() => handleFilterClick("priceRange", price)}
                      type="button"
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-modal-section">
                <div className="filter-modal-label">Animaux</div>
                <div className="filter-modal-group">
                  {ANIMALS.map((animal) => (
                    <button
                      key={animal}
                      className={`filter-btn${filters.animals === animal ? " active" : ""}`}
                      onClick={() => handleFilterClick("animals", animal)}
                      type="button"
                    >
                      {animal}
                    </button>
                  ))}
                </div>
              </div>
              <button className="filter-modal-apply" onClick={() => setShowFilters(false)}>
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
