import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Club {
  id: number;
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  coords: [number, number];
  training_school: string;
  activity: string;
  price: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

// Mise en cache des requêtes
export const getAllClubs = cache(async (): Promise<{ clubs: Club[], total: number }> => {
  const { data, error, count } = await supabase
    .from('clubs')
    .select('*', { count: 'exact' })
    .order('name');

  if (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }

  return {
    clubs: (data || []).map(club => ({
      ...club,
      image: club.image.startsWith('/') ? club.image : `/clubs/${club.image}`,
      location: club.location || club.name
    })),
    total: count || 0
  };
});

export const getClubBySlug = cache(async (slug: string): Promise<Club | null> => {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching club:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    image: data.image.startsWith('/') ? data.image : `/clubs/${data.image}`,
    location: data.location || data.name
  };
});

// Fonction pour obtenir les clubs par pays
export const getClubsByCountry = cache(async (country: string): Promise<Club[]> => {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('country', country)
    .order('name');

  if (error) {
    console.error('Error fetching clubs by country:', error);
    throw error;
  }

  return (data || []).map(club => ({
    ...club,
    image: club.image.startsWith('/') ? club.image : `/clubs/${club.image}`,
    location: club.location || club.name
  }));
}); 