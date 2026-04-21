import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Gemach } from './types'

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const getAllGemachs = cache(async (): Promise<Gemach[]> => {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .eq('verified', true)
    .order('priority', { ascending: false })
  if (error) {
    console.error('getAllGemachs error:', error)
    return []
  }
  return data || []
})

export const getGemachBySlug = cache(async (slug: string): Promise<Gemach | null> => {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .eq('slug', slug)
    .eq('verified', true)
    .maybeSingle()
  if (error) {
    console.error('getGemachBySlug error:', error)
    return null
  }
  return data
})

export const getGemachsByLocation = cache(async (location: string): Promise<Gemach[]> => {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .eq('verified', true)
    .eq('location', location)
    .order('priority', { ascending: false })
  if (error) {
    console.error('getGemachsByLocation error:', error)
    return []
  }
  return data || []
})

export const getAllSlugs = cache(async (): Promise<string[]> => {
  const supabase = anonClient()
  const { data } = await supabase
    .from('gemachs')
    .select('slug')
    .eq('verified', true)
    .not('slug', 'is', null)
  return (data || []).map((r: { slug: string }) => r.slug)
})

export const getAllLocations = cache(async (): Promise<Array<{ location: string; count: number }>> => {
  const supabase = anonClient()
  const { data } = await supabase
    .from('gemachs')
    .select('location')
    .eq('verified', true)
  const counts = new Map<string, number>()
  for (const row of data || []) {
    counts.set(row.location, (counts.get(row.location) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
})

export function townToSlug(location: string): string {
  return location
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugToTown(slug: string, locations: string[]): string | null {
  return locations.find((l) => townToSlug(l) === slug) || null
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://gemachfinder.com'
}
