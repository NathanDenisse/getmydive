import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Spot {
  id: number;
  name: string;
  slug: string;
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
  location: string;
  created_at: string;
  updated_at: string;
}

// Mise en cache des requêtes
export const getAllSpots = cache(async (): Promise<{ spots: Spot[], total: number }> => {
  const { data, error, count } = await supabase
    .from('spots')
    .select('*', { count: 'exact' })
    .order('name');

  if (error) {
    console.error('Error fetching spots:', error);
    throw error;
  }

  return {
    spots: (data || []).map(spot => ({
      ...spot,
      image: spot.image.startsWith('/') ? spot.image : `/spots/${spot.image}`,
      location: spot.location || spot.name
    })),
    total: count || 0
  };
});

export const getSpotBySlug = cache(async (slug: string): Promise<Spot | null> => {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching spot:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    image: data.image.startsWith('/') ? data.image : `/spots/${data.image}`,
    location: data.location || data.name
  };
});

// Fonction pour obtenir les spots par pays
export const getSpotsByCountry = cache(async (country: string): Promise<Spot[]> => {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('country', country)
    .order('name');

  if (error) {
    console.error('Error fetching spots by country:', error);
    throw error;
  }

  return (data || []).map(spot => ({
    ...spot,
    image: spot.image.startsWith('/') ? spot.image : `/spots/${spot.image}`,
    location: spot.location || spot.name
  }));
});

// Fonction pour obtenir les spots par niveau
export const getSpotsByLevel = cache(async (level: string): Promise<Spot[]> => {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('level', level)
    .order('name');

  if (error) {
    console.error('Error fetching spots by level:', error);
    throw error;
  }

  return (data || []).map(spot => ({
    ...spot,
    image: spot.image.startsWith('/') ? spot.image : `/spots/${spot.image}`,
    location: spot.location || spot.name
  }));
}); 