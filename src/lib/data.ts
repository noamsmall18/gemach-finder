import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Gemach } from './types'

const EXCLUDED_PUBLIC_LOCATION = 'Monsey, NY'
const EXCLUDED_PUBLIC_TEXT = /\bmonsey\b/i

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function isPublicGemach(gemach: Gemach): boolean {
  if (gemach.location === EXCLUDED_PUBLIC_LOCATION) return false

  return ![
    gemach.name,
    gemach.description,
    gemach.location,
    gemach.contact_name,
    gemach.contact_email,
    gemach.contact_website,
    gemach.address,
    gemach.notes,
    gemach.slug,
  ].some((value) => value && EXCLUDED_PUBLIC_TEXT.test(value))
}

const getVerifiedGemachs = cache(async (): Promise<Gemach[]> => {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .eq('verified', true)
    .neq('location', EXCLUDED_PUBLIC_LOCATION)
    .order('priority', { ascending: false })
  if (error) {
    console.error('getVerifiedGemachs error:', error)
    return []
  }
  return (data || []).filter(isPublicGemach)
})

export const getAllGemachs = cache(async (): Promise<Gemach[]> => {
  return getVerifiedGemachs()
})

export const getGemachBySlug = cache(async (slug: string): Promise<Gemach | null> => {
  const gemachs = await getVerifiedGemachs()
  return gemachs.find((gemach) => gemach.slug === slug) || null
})

export const getGemachsByLocation = cache(async (location: string): Promise<Gemach[]> => {
  if (location === EXCLUDED_PUBLIC_LOCATION) return []
  const gemachs = await getVerifiedGemachs()
  return gemachs.filter((gemach) => gemach.location === location)
})

export function getSiblings(
  gemach: Gemach,
  townList: Gemach[]
): { prev: Gemach | null; next: Gemach | null } {
  const sorted = [...townList].sort((a, b) => a.name.localeCompare(b.name))
  const idx = sorted.findIndex((g) => g.id === gemach.id)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}

export const getAllSlugs = cache(async (): Promise<string[]> => {
  const gemachs = await getVerifiedGemachs()
  return gemachs
    .map((gemach) => gemach.slug)
    .filter((slug): slug is string => Boolean(slug))
})

export const getGemachCount = cache(async (): Promise<number> => {
  const gemachs = await getVerifiedGemachs()
  return gemachs.length
})

export const getAllLocations = cache(async (): Promise<Array<{ location: string; count: number }>> => {
  const gemachs = await getVerifiedGemachs()
  const counts = new Map<string, number>()
  for (const gemach of gemachs) {
    counts.set(gemach.location, (counts.get(gemach.location) || 0) + 1)
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
