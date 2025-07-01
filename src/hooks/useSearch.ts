import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CACHE_KEYS } from '../constants';
import type { Spot } from '../types';

export function useSearch(spots: Spot[]) {
  const [query, setQuery] = useLocalStorage<string>(CACHE_KEYS.QUERY, '');

  const filteredSpots = useMemo(() => {
    if (!spots || !Array.isArray(spots)) return [];
    if (!query) return spots;

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return spots.filter((spot) => {
      if (!spot) return false;
      const searchable = [
        spot.name,
        spot.country,
        spot.description,
        spot.activity,
        spot.level,
        spot.price,
        ...(spot.animals || []),
      ].join(' ').toLowerCase();

      return terms.every(term => searchable.includes(term));
    });
  }, [query, spots]);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, [setQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  return {
    query,
    filteredSpots,
    handleSearch,
    clearSearch,
  };
} 