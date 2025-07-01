import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Spot } from './types';

async function getWeatherData(lat: number, lon: number) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    return {
      temperature: response.data.main.temp - 273.15, // Conversion de Kelvin en Celsius
      weather_conditions: response.data.weather[0].description
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo:', error);
    return null;
  }
}

async function getMarineData(lat: number, lon: number) {
  try {
    const response = await axios.get(
      `https://api.marine-api.com/v1/marine-data?lat=${lat}&lon=${lon}&key=${process.env.MARINE_API_KEY}`
    );
    return {
      visibility: response.data.visibility,
      current: response.data.current_speed,
      temperature: response.data.water_temperature
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données marines:', error);
    return null;
  }
}

async function enrichSpot(spot: Spot): Promise<Spot> {
  const [lat, lon] = spot.coords;

  // Récupérer les données météo
  const weatherData = await getWeatherData(lat, lon);
  if (weatherData) {
    spot.temperature = weatherData.temperature;
    spot.weather_conditions = weatherData.weather_conditions;
  }

  // Récupérer les données marines
  const marineData = await getMarineData(lat, lon);
  if (marineData) {
    spot.visibility = marineData.visibility;
    spot.current = marineData.current;
    if (!weatherData) {
      spot.temperature = marineData.temperature;
    }
  }

  return spot;
}

async function enrichAllSpots() {
  try {
    // Lire les spots scrapés
    const spotsPath = path.join(__dirname, '../../src/data/scraped_spots.json');
    const spots: Spot[] = JSON.parse(fs.readFileSync(spotsPath, 'utf-8'));

    console.log(`Enrichissement de ${spots.length} spots...`);

    // Enrichir chaque spot
    const enrichedSpots = await Promise.all(
      spots.map(async (spot) => {
        console.log(`Enrichissement du spot: ${spot.name}`);
        return await enrichSpot(spot);
      })
    );

    // Sauvegarder les spots enrichis
    const outputPath = path.join(__dirname, '../../src/data/enriched_spots.json');
    fs.writeFileSync(outputPath, JSON.stringify(enrichedSpots, null, 2));
    console.log(`Spots enrichis sauvegardés dans ${outputPath}`);

    return enrichedSpots;
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement des spots:', error);
    return [];
  }
}

// Exécuter l'enrichissement
enrichAllSpots().then(() => {
  console.log('Enrichissement terminé !');
}); 