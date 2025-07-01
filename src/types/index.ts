export interface Spot {
  slug: string;
  name: string;
  country: string;
  description: string;
  image: string;
  coords: [number, number];
  animals: string[];
  level: string;
  activity: string;
  price: string;
  temperature: number;
  visibility: number;
  current: string;
  depthRange: string;
  bestSeason: string;
  category: string;
  region?: string;
  accessibility?: string;
  infrastructure?: string[];
  marine_reserve?: boolean;
  certification_required?: string[];
  max_depth?: number;
  min_depth?: number;
  dive_sites?: string[];
  local_operators?: string[];
  conservation_status?: string;
  weather_conditions?: string;
  local_language?: string[];
  currency?: string;
  timezone?: string;
}

export interface Club {
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  trainingSchool: boolean;
  rating: number;
  experiences?: Experience[];
}

export interface Experience {
  slug: string;
  title: string;
  description: string;
  price: string;
  level: string;
  activity: string;
  animals: string[];
  image: string;
  rating: number;
  reviews: Review[];
}

export interface Review {
  author: string;
  comment: string;
  rating: number;
}

export interface WeatherConditions {
  temperature: number;
  visibility: number;
  current: string;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  swellDirection: string;
  tide: string;
} 