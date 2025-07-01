import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Charger les variables d'environnement
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Lire le fichier JSON enrichi
const spotsPath = path.join(__dirname, '../../src/data/spots_with_countries.json')
const spots: Spot[] = JSON.parse(fs.readFileSync(spotsPath, 'utf-8'))

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
}

async function importSpots() {
  try {
    // Upsert (mise à jour ou insertion) sur le champ 'slug'
    const { data, error } = await supabase
      .from('spots')
      .upsert(spots, { onConflict: 'slug' })
      .select()

    if (error) {
      throw error
    }

    console.log(`${spots.length} spots upsertés avec succès`)
    console.log('Spots upsertés:', data)
  } catch (error) {
    console.error('Erreur lors de l\'importation des spots:', error)
  }
}

importSpots() 