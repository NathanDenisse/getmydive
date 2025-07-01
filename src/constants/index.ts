export const ACTIVITIES = ['Plongée', 'Snorkeling', 'Freediving'] as const;
export const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'] as const;
export const PRICE_RANGES = ['Bas', 'Moyen', 'Élevé'] as const;
export const ANIMALS = ['Requins', 'Raies', 'Tortues', 'Poissons tropicaux'] as const;

export const CACHE_KEYS = {
  QUERY: 'search_query',
  FILTERS: 'search_filters',
  SHOW_MAP: 'show_map',
} as const;

export const MAP_DEFAULTS = {
  CENTER: [20.422983, -86.922343] as [number, number],
  ZOOM: 2,
} as const;

export const API_ENDPOINTS = {
  SPOTS: '/api/spots',
  CLUBS: '/api/clubs',
  EXPERIENCES: '/api/experiences',
} as const; 