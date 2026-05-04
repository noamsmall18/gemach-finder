'use server'

import { createClient } from '@supabase/supabase-js'
import { getClientIpHash, isRateLimitError } from '@/lib/rateLimit'

type Result = { ok: true } | { ok: false; error: 'rate_limited' | 'invalid' | 'unknown' }

export async function submitSuggestionAction(input: {
  gemach_name: string
  category: string
  description: string
  contact_info: string
  submitted_by?: string
}): Promise<Result> {
  if (!input.gemach_name || !input.category || !input.description || !input.contact_info) {
    return { ok: false, error: 'invalid' }
  }

  const ipHash = await getClientIpHash()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.rpc('submit_suggestion', {
    p_gemach_name: input.gemach_name.slice(0, 120),
    p_category: input.category.slice(0, 80),
    p_description: input.description.slice(0, 1000),
    p_contact_info: input.contact_info.slice(0, 200),
    p_submitted_by: input.submitted_by ? input.submitted_by.slice(0, 120) : null,
    p_ip_hash: ipHash,
  })

  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' }
    console.error('submitSuggestionAction error:', error)
    return { ok: false, error: 'unknown' }
  }
  return { ok: true }
}
