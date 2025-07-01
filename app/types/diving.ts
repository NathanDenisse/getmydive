export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  country: string;
  city?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface DivingSpot {
  id: string;
  name: string;
  location: Location;
  type: 'spot' | 'club';
  description: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  depth: number;
  visibility: number;
  facilities: string[];
  contact: Contact;
  reviews: Review[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DivingSpotFilters {
  country?: string;
  difficulty?: string;
  type?: 'spot' | 'club';
  minDepth?: number;
  maxDepth?: number;
} 