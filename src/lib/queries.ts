import { supabase } from './supabase/client'
import type { Spot } from '@/types'

export type GetAllSpotsParams = {
  pageSize?: number
  page?: number
}

export async function getAllSpots({ pageSize = 50, page = 1 }: GetAllSpotsParams = {}) {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Spot[]
}

export async function getSpotSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('spots')
      .select('slug')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase getSpotSlugs:', error)
      return []
    }

    return data?.map((spot) => spot.slug) ?? []
  } catch (error) {
    console.error('Erreur lors de la récupération des slugs:', error)
    return []
  }
}

export async function getSpotBySlug(slug: string) {
  try {
    const { data, error } = await supabase.from('spots').select('*').eq('slug', slug).single()

    if (error) {
      console.error(`Erreur Supabase getSpotBySlug pour ${slug}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Erreur lors de la récupération du spot ${slug}:`, error)
    return null
  }
}

export async function getClubSlugs(): Promise<string[]> {
  const { data } = await supabase.from('clubs').select('slug')
  return data?.map(c => c.slug) ?? []
}

export async function getClubBySlug(slug: string) {
  const { data } = await supabase.from('clubs').select('*').eq('slug', slug).single()
  return data
} 