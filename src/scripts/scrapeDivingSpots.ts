import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Spot } from './types';

// Configuration
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Requête Overpass pour les spots de plongée
const OVERPASS_QUERY = `
[out:json][timeout:25];
(
  node["leisure"="diving_spot"];
  node["sport"="scuba_diving"];
  node["amenity"="diving_spot"];
  way["leisure"="diving_spot"];
  way["sport"="scuba_diving"];
  way["amenity"="diving_spot"];
);
out body;
>;
out skel qt;
`;

// Fonction pour nettoyer et valider les données
function cleanAndValidateSpot(spot: any): Partial<Spot> | null {
  if (!spot.tags || !spot.tags.name) return null;
  return {
    name: spot.tags.name,
    slug: spot.tags.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    country: spot.tags['addr:country'] || 'Pays inconnu',
    description: spot.tags.description || spot.tags['diving:description'] || 'Aucune description disponible',
    coords: [spot.lat, spot.lon],
    level: spot.tags['diving:level'] || 'Tous niveaux',
    activity: 'Plongée',
    price: spot.tags['diving:price'] || 'Moyen',
    temperature: 25,
    visibility: 20,
    current: spot.tags['diving:current'] || 'Modéré',
    depthRange: spot.tags['diving:depth'] || '5-30m',
    bestSeason: spot.tags['diving:season'] || "Toute l'année",
    category: spot.tags['diving:category'] || 'Récif',
    animals: (spot.tags['diving:animals'] || '').split(',').filter(Boolean),
    location: spot.tags['addr:city'] || spot.tags['addr:town'] || spot.tags['addr:village'] || '',
    image: '/spots/default.jpg'
  };
}

async function scrapeDivingSpots() {
  console.log('Début du scraping des spots de plongée...');

  try {
    // Récupérer les données d'OpenStreetMap
    console.log('Récupération des données OpenStreetMap...');
    const response = await axios.post(OVERPASS_API, OVERPASS_QUERY);
    const elements = response.data.elements;

    console.log(`${elements.length} spots trouvés sur OpenStreetMap`);

    const spots: Spot[] = [];
    let processedCount = 0;

    // Traiter chaque spot
    for (const element of elements) {
      try {
        const spot = cleanAndValidateSpot(element);
        if (spot) {
          spots.push(spot as Spot);
        }
        processedCount++;

        // Afficher la progression
        if (processedCount % 10 === 0) {
          console.log(`${processedCount}/${elements.length} spots traités`);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement du spot ${element.id}:`, error);
      }
    }

    // Sauvegarder les résultats
    const outputPath = path.join(__dirname, '../../src/data/scraped_spots.json');
    fs.writeFileSync(outputPath, JSON.stringify(spots, null, 2));
    console.log(`Données sauvegardées dans ${outputPath}`);

    return spots;
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    return [];
  }
}

// Exécuter le scraping
scrapeDivingSpots().then(() => {
  console.log('Scraping terminé !');
}); 