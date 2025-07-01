import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Spot } from './types';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Vérification des variables d'environnement requises
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENCAGE_API_KEY',
  'OPENWEATHER_API_KEY',
  'STORMGLASS_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes :');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

// Configuration
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Requête Overpass pour les spots de plongée
const DIVING_SPOTS_QUERY = `
[out:json][timeout:25];
(
  node["leisure"="diving_spot"];
  node["sport"="diving"];
  node["amenity"="diving_spot"];
  way["leisure"="diving_spot"];
  way["sport"="diving"];
  way["amenity"="diving_spot"];
);
out body;
>;
out skel qt;
`;

async function fetchDivingSpotsFromOSM() {
  try {
    console.log('Récupération des spots de plongée depuis OpenStreetMap...');
    const response = await axios.post(OVERPASS_API, DIVING_SPOTS_QUERY, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const spots: Partial<Spot>[] = [];
    const elements = response.data.elements;

    for (const element of elements) {
      if (element.tags) {
        const name = element.tags.name || `Spot de plongée ${element.id}`;
        const spot: Partial<Spot> = {
          name,
          country: element.tags['addr:country'] || 'Inconnu',
          description: element.tags.description || element.tags.note || '',
          coords: [element.lat, element.lon],
          level: element.tags.difficulty || 'Tous niveaux',
          activity: 'Plongée',
          price: element.tags.fee ? 'Payant' : 'Gratuit',
          temperature: 0, // Sera enrichi plus tard
          visibility: 0, // Sera enrichi plus tard
          current: 'Modéré', // Sera enrichi plus tard
          depthRange: element.tags.depth || '0-30m',
          bestSeason: element.tags.season || 'Toute l\'année',
          category: element.tags.type || 'Récif',
          infrastructure: [
            ...(element.tags.showers ? ['Douches'] : []),
            ...(element.tags.toilets ? ['Toilettes'] : []),
            ...(element.tags.parking ? ['Parking'] : []),
            ...(element.tags.rental ? ['Location de matériel'] : [])
          ],
          marine_reserve: element.tags.protected === 'yes',
          certification_required: element.tags.certification ? [element.tags.certification] : [],
          image: element.tags.image || '/images/noimage.jpg', // Image par défaut
          animals: [], // Initialisation avec un tableau vide
          slug: element.tags.slug || generateSlug(name) // Génération du slug si absent
        };

        // Ajouter des tags supplémentaires si disponibles
        if (element.tags.website) spot.website = element.tags.website;
        if (element.tags.phone) spot.phone = element.tags.phone;
        if (element.tags.email) spot.email = element.tags.email;

        spots.push(spot);
      }
    }

    console.log(`${spots.length} spots trouvés sur OpenStreetMap`);
    return spots;
  } catch (error) {
    console.error('Erreur lors de la récupération des spots depuis OpenStreetMap:', error);
    return [];
  }
}

async function enrichSpotData(spot: Partial<Spot>): Promise<Spot> {
  try {
    const [lat, lon] = spot.coords!;

    // Données météo
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    spot.temperature = weatherResponse.data.main.temp - 273.15;
    spot.weather_conditions = weatherResponse.data.weather[0].description;

    // Données marines via Stormglass
    try {
      const marineResponse = await axios.get(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=waterTemperature,waveHeight,currentSpeed`,
        {
          headers: {
            'Authorization': process.env.STORMGLASS_API_KEY
          }
        }
      );

      const marineData = marineResponse.data.hours[0];
      if (marineData) {
        spot.temperature = marineData.waterTemperature?.value || spot.temperature;
        spot.visibility = marineData.waveHeight?.value || 0;
        spot.current = marineData.currentSpeed?.value ?
          `${marineData.currentSpeed.value} m/s` :
          'Modéré';
      }
    } catch (error) {
      console.log('Données marines non disponibles');
    }

    // Génération du slug
    spot.slug = generateSlug(spot.name!);

    return spot as Spot;
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement des données:', error);
    return spot as Spot;
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  try {
    console.log('Début de la mise à jour des spots...');

    // 1. Récupération des spots depuis OpenStreetMap
    const spots = await fetchDivingSpotsFromOSM();
    console.log(`${spots.length} spots trouvés sur OpenStreetMap`);

    // 2. Filtrage des spots valides
    const validSpots = spots.filter(spot => spot.coords && spot.coords.length === 2);
    console.log(`${validSpots.length} spots valides sur ${spots.length} spots trouvés`);

    // 3. Enrichissement des données
    console.log('Enrichissement des données...');
    const enrichedSpots = await Promise.all(
      validSpots.map(spot => enrichSpotData(spot as Spot))
    );

    // 4. Sauvegarde des données enrichies
    const enrichedDataPath = path.join(process.cwd(), 'src/data/enriched_spots.json');
    fs.writeFileSync(enrichedDataPath, JSON.stringify(enrichedSpots, null, 2));
    console.log(`Données enrichies sauvegardées dans ${enrichedDataPath}`);

    // 5. Mise à jour dans Supabase
    await updateSpotsInSupabase(enrichedSpots);

    console.log('Mise à jour terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    process.exit(1);
  }
}

async function updateSpotsInSupabase(spots: Spot[]) {
  console.log('Mise à jour dans Supabase...');

  for (const spot of spots) {
    try {
      // Vérifier si le spot existe déjà
      const { data: existingSpot } = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
        .from('spots')
        .select('id')
        .eq('slug', spot.slug)
        .single();

      if (existingSpot) {
        // Mettre à jour le spot existant
        const { error: updateError } = await createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
          .from('spots')
          .update({
            name: spot.name,
            country: spot.country,
            description: spot.description,
            image: spot.image,
            coords: spot.coords,
            level: spot.level,
            activity: spot.activity,
            price: spot.price,
            temperature: spot.temperature,
            visibility: spot.visibility,
            current: spot.current,
            depthRange: spot.depthRange,
            bestSeason: spot.bestSeason,
            category: spot.category,
            infrastructure: spot.infrastructure,
            marine_reserve: spot.marine_reserve,
            certification_required: spot.certification_required,
            animals: spot.animals,
            website: spot.website,
            phone: spot.phone,
            email: spot.email,
            weather_conditions: spot.weather_conditions,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSpot.id);

        if (updateError) {
          console.error(`Erreur lors de la mise à jour du spot ${spot.slug}:`, updateError);
        } else {
          console.log(`Spot ${spot.slug} mis à jour avec succès`);
        }
      } else {
        // Insérer un nouveau spot
        const { error: insertError } = await createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
          .from('spots')
          .insert([{
            ...spot,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error(`Erreur lors de l'insertion du spot ${spot.slug}:`, insertError);
        } else {
          console.log(`Spot ${spot.slug} inséré avec succès`);
        }
      }
    } catch (error) {
      console.error(`Erreur lors du traitement du spot ${spot.slug}:`, error);
    }
  }
}

// Exécution de la mise à jour
main(); 