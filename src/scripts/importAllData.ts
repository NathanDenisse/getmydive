import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { parse } from 'csv-parse/sync'

// Charger les variables d'environnement
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface Spot {
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

async function importFromJSON() {
  try {
    const spotsPath = path.join(__dirname, '../../src/data/spots.json')
    const spots = JSON.parse(fs.readFileSync(spotsPath, 'utf-8'))
    await importSpots(spots)
  } catch (error) {
    console.error('Erreur lors de l\'importation depuis JSON:', error)
  }
}

async function importFromCSV(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    const spots = records.map((record: any) => ({
      slug: record.slug || generateSlug(record.name),
      name: record.name,
      country: record.country,
      description: record.description,
      image: record.image,
      coords: [parseFloat(record.latitude), parseFloat(record.longitude)],
      animals: record.animals ? record.animals.split(',').map((a: string) => a.trim()) : [],
      level: record.level,
      activity: record.activity,
      price: record.price,
      temperature: parseFloat(record.temperature),
      visibility: parseFloat(record.visibility),
      current: record.current,
      depthRange: record.depthRange,
      bestSeason: record.bestSeason,
      category: record.category,
      // Nouveaux champs
      region: record.region,
      accessibility: record.accessibility,
      infrastructure: record.infrastructure ? record.infrastructure.split(',').map((i: string) => i.trim()) : [],
      marine_reserve: record.marine_reserve === 'true',
      certification_required: record.certification_required ? record.certification_required.split(',').map((c: string) => c.trim()) : [],
      max_depth: record.max_depth ? parseFloat(record.max_depth) : undefined,
      min_depth: record.min_depth ? parseFloat(record.min_depth) : undefined,
      dive_sites: record.dive_sites ? record.dive_sites.split(',').map((d: string) => d.trim()) : [],
      local_operators: record.local_operators ? record.local_operators.split(',').map((o: string) => o.trim()) : [],
      conservation_status: record.conservation_status,
      weather_conditions: record.weather_conditions,
      local_language: record.local_language ? record.local_language.split(',').map((l: string) => l.trim()) : [],
      currency: record.currency,
      timezone: record.timezone
    }))

    await importSpots(spots)
  } catch (error) {
    console.error('Erreur lors de l\'importation depuis CSV:', error)
  }
}

async function importFromAPI(apiUrl: string) {
  try {
    const response = await axios.get(apiUrl)
    const spots = response.data
    await importSpots(spots)
  } catch (error) {
    console.error('Erreur lors de l\'importation depuis API:', error)
  }
}

async function importSpots(spots: Spot[]) {
  try {
    // Vérifier si les spots existent déjà
    const { data: existingSpots } = await supabase
      .from('spots')
      .select('slug')

    const existingSlugs = existingSpots?.map((spot: { slug: string }) => spot.slug) || []

    // Filtrer les nouveaux spots
    const newSpots = spots.filter((spot: Spot) => !existingSlugs.includes(spot.slug))

    if (newSpots.length === 0) {
      console.log('Aucun nouveau spot à importer')
      return
    }

    // Insérer les nouveaux spots
    const { data, error } = await supabase
      .from('spots')
      .insert(newSpots)
      .select()

    if (error) {
      throw error
    }

    console.log(`${newSpots.length} spots importés avec succès`)
    console.log('Spots importés:', data)
  } catch (error) {
    console.error('Erreur lors de l\'importation des spots:', error)
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function importAllData() {
  // Importer depuis le fichier JSON local
  await importFromJSON()

  // Importer depuis un fichier CSV (à adapter selon vos besoins)
  const csvPath = path.join(__dirname, '../../src/data/spots.csv')
  if (fs.existsSync(csvPath)) {
    await importFromCSV(csvPath)
  }

  // Importer depuis une API (à adapter selon vos besoins)
  const apiUrl = process.env.DIVING_SPOTS_API_URL
  if (apiUrl) {
    await importFromAPI(apiUrl)
  }
}

importAllData() 