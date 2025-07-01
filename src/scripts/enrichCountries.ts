import fs from 'fs';
import fetch from 'node-fetch';

const INPUT_PATH = 'src/data/spots.json';
const OUTPUT_PATH = 'src/data/spots_with_countries.json';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&zoom=3&addressdetails=1';

async function getCountry(lat: number, lon: number): Promise<string> {
  try {
    const url = `${NOMINATIM_URL}&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'getmydive/1.0 (contact@getmydive.com)' }
    });
    if (!res.ok) return 'Inconnu';
    const data: any = await res.json();
    return data.address?.country || 'Inconnu';
  } catch {
    return 'Inconnu';
  }
}

async function enrichCountries() {
  const spots = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    if (spot.coords && spot.coords[0] != null && spot.coords[1] != null) {
      // Si le pays est déjà renseigné, on ne touche pas
      if (!spot.country || spot.country === 'Pays inconnu' || spot.country === 'Inconnu') {
        const country = await getCountry(spot.coords[0], spot.coords[1]);
        spot.country = country;
        console.log(`[${i + 1}/${spots.length}] ${spot.name} → ${country}`);
        // Petite pause pour ne pas surcharger l'API
        await new Promise(r => setTimeout(r, 1100));
      }
    }
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spots, null, 2));
  console.log('Enrichissement terminé. Résultat dans', OUTPUT_PATH);
}

enrichCountries(); 