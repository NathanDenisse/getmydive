import type { Spot } from '../types';

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function generateSlug(name: string): string {
  return normalizeSlug(name);
}

export function getSpotDistance(spot1: Spot, spot2: Spot): number {
  if (!spot1.coords || !spot2.coords) return Infinity;

  const [lat1, lon1] = spot1.coords;
  const [lat2, lon2] = spot2.coords;

  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance)}km`;
}

export function getSpotWeather(spot: Spot): string {
  const conditions = [];
  if (spot.temperature) conditions.push(`${spot.temperature}°C`);
  if (spot.visibility) conditions.push(`Visibilité: ${spot.visibility}m`);
  if (spot.current) conditions.push(`Courant: ${spot.current}`);
  return conditions.join(' • ');
}

export function getSpotDifficulty(spot: Spot): string {
  const conditions = [];
  if (spot.level) conditions.push(`Niveau: ${spot.level}`);
  if (spot.depthRange) conditions.push(`Profondeur: ${spot.depthRange}`);
  return conditions.join(' • ');
}

export function getSpotInfrastructure(spot: Spot): string {
  if (!spot.infrastructure || spot.infrastructure.length === 0) {
    return 'Aucune infrastructure';
  }
  return spot.infrastructure.join(' • ');
}

export function getSpotAnimals(spot: Spot): string {
  if (!spot.animals || spot.animals.length === 0) {
    return 'Aucun animal signalé';
  }
  return spot.animals.join(' • ');
} 