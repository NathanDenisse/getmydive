import { useReducer, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CACHE_KEYS } from '../constants';

export type FilterState = {
  activity: string;
  level: string;
  priceRange: string;
  animals: string;
};

type FilterAction = {
  type: 'SET_FILTER' | 'RESET_FILTERS';
  payload?: {
    key: keyof FilterState;
    value: string;
  };
};

const initialFilters: FilterState = {
  activity: '',
  level: '',
  priceRange: '',
  animals: '',
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      if (!action.payload) return state;
      return {
        ...state,
        [action.payload.key]: state[action.payload.key] === action.payload.value ? '' : action.payload.value,
      };
    case 'RESET_FILTERS':
      return initialFilters;
    default:
      return state;
  }
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);
  const [storedFilters, setStoredFilters] = useLocalStorage<FilterState>(CACHE_KEYS.FILTERS, initialFilters);

  const setFilter = useCallback((key: keyof FilterState, value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // Synchroniser avec le localStorage
  const updateStoredFilters = useCallback((newFilters: FilterState) => {
    setStoredFilters(newFilters);
  }, [setStoredFilters]);

  return {
    filters,
    setFilter,
    resetFilters,
    updateStoredFilters,
  };
} 