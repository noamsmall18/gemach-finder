import { supabase } from './supabase'
import type { WishlistItem } from './types'

export async function fetchWishlistItems(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('status', 'open')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }

  return data || []
}

export async function submitWishlistItem(item: {
  name: string
  category: string
  description?: string
  requested_by?: string
}): Promise<WishlistItem | null> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert({
      name: item.name,
      category: item.category,
      description: item.description || null,
      requested_by: item.requested_by || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting wishlist item:', error)
    return null
  }

  return data
}

export async function voteForItem(itemId: string, fingerprint: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('vote_wishlist_item', {
    item_id: itemId,
    fingerprint,
  })

  if (error) {
    console.error('Error voting:', error)
    return false
  }

  return data === true
}

export async function unvoteForItem(itemId: string, fingerprint: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('unvote_wishlist_item', {
    item_id: itemId,
    fingerprint,
  })

  if (error) {
    console.error('Error unvoting:', error)
    return false
  }

  return data === true
}

const FINGERPRINT_KEY = 'gemach-voter-id'
const VOTED_KEY = 'gemach-wishlist-votes'

export function getOrCreateFingerprint(): string {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem(FINGERPRINT_KEY)
  if (!fp) {
    fp = crypto.randomUUID()
    localStorage.setItem(FINGERPRINT_KEY, fp)
  }
  return fp
}

export function getVotedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(VOTED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function addVotedId(id: string): void {
  if (typeof window === 'undefined') return
  const ids = getVotedIds()
  ids.add(id)
  localStorage.setItem(VOTED_KEY, JSON.stringify([...ids]))
}

export function removeVotedId(id: string): void {
  if (typeof window === 'undefined') return
  const ids = getVotedIds()
  ids.delete(id)
  localStorage.setItem(VOTED_KEY, JSON.stringify([...ids]))
}
