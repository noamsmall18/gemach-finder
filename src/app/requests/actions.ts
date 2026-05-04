'use server'

import { createClient } from '@supabase/supabase-js'
import { getClientIpHash, isRateLimitError } from '@/lib/rateLimit'
import type { WishlistItem } from '@/lib/types'

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

type ErrorCode = 'rate_limited' | 'invalid' | 'unknown' | 'not_found'

export async function submitWishlistAction(input: {
  name: string
  category: string
  description?: string
  requested_by?: string
  fingerprint: string
}): Promise<{ ok: true; item: WishlistItem } | { ok: false; error: ErrorCode }> {
  if (!input.name || !input.category) return { ok: false, error: 'invalid' }

  const ipHash = await getClientIpHash()
  const supabase = anonClient()

  const { data: newId, error } = await supabase.rpc('submit_wishlist_item', {
    p_name: input.name.slice(0, 120),
    p_category: input.category.slice(0, 80),
    p_description: input.description ? input.description.slice(0, 500) : null,
    p_requested_by: input.requested_by ? input.requested_by.slice(0, 120) : null,
    p_fingerprint: input.fingerprint || '',
    p_ip_hash: ipHash,
  })

  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' }
    console.error('submitWishlistAction error:', error)
    return { ok: false, error: 'unknown' }
  }

  const { data: row } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('id', newId)
    .maybeSingle()

  if (!row) return { ok: false, error: 'not_found' }
  return { ok: true, item: row as WishlistItem }
}

export async function voteAction(
  itemId: string,
  fingerprint: string
): Promise<{ ok: boolean; error?: ErrorCode }> {
  if (!fingerprint) return { ok: false, error: 'invalid' }

  const ipHash = await getClientIpHash()
  const supabase = anonClient()
  const { data, error } = await supabase.rpc('vote_wishlist_item', {
    item_id: itemId,
    fingerprint,
    ip_hash: ipHash,
  })

  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' }
    console.error('voteAction error:', error)
    return { ok: false, error: 'unknown' }
  }
  return { ok: data === true }
}

export async function unvoteAction(
  itemId: string,
  fingerprint: string
): Promise<{ ok: boolean; error?: ErrorCode }> {
  if (!fingerprint) return { ok: false, error: 'invalid' }

  const ipHash = await getClientIpHash()
  const supabase = anonClient()
  const { data, error } = await supabase.rpc('unvote_wishlist_item', {
    item_id: itemId,
    fingerprint,
    ip_hash: ipHash,
  })

  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' }
    console.error('unvoteAction error:', error)
    return { ok: false, error: 'unknown' }
  }
  return { ok: data === true }
}
