'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { getClientIpHash, isRateLimitError } from '@/lib/rateLimit'
import {
  buildGemachUpdateChanges,
  hasGemachUpdateChanges,
  serializeGemachUpdateRequest,
} from '@/lib/gemachUpdateRequests'

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function markUsed(gemachId: string, slug: string) {
  const jar = await cookies()
  const key = `used_${gemachId}`
  if (jar.get(key)) {
    return { ok: true, already: true }
  }
  const sc = serviceClient()
  const { data: row } = await sc.from('gemachs').select('used_count').eq('id', gemachId).maybeSingle()
  const next = (row?.used_count ?? 0) + 1
  await sc.from('gemachs').update({ used_count: next }).eq('id', gemachId)
  jar.set(key, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  revalidatePath(`/g/${slug}`)
  return { ok: true, already: false, count: next }
}

export async function reportOutdated(gemachId: string, slug: string, reason: string) {
  const trimmed = (reason || '').trim().slice(0, 500)
  const ipHash = await getClientIpHash()
  const supabase = anonClient()
  const { error } = await supabase.rpc('report_gemach', {
    p_gemach_id: gemachId,
    p_reason: trimmed || null,
    p_ip_hash: ipHash,
  })
  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' as const }
    console.error('reportOutdated error:', error)
    return { ok: false, error: 'unknown' as const }
  }
  revalidatePath(`/g/${slug}`)
  return { ok: true as const }
}

type UpdateRequestInput = {
  gemachId: string
  gemachSlug: string | null
  gemachName: string
  category: string
  submittedBy?: string
  submittedByContact: string
  claimsOperator: boolean
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  contact_website?: string
  hours?: string
  address?: string
  notes?: string
}

type UpdateRequestResult =
  | { ok: true }
  | { ok: false; error: 'invalid' | 'rate_limited' | 'unknown' }

export async function submitGemachUpdateAction(
  input: UpdateRequestInput
): Promise<UpdateRequestResult> {
  const submittedByContact = (input.submittedByContact || '').trim().slice(0, 180)
  const changes = buildGemachUpdateChanges({
    contact_name: input.contact_name,
    contact_phone: input.contact_phone,
    contact_email: input.contact_email,
    contact_website: input.contact_website,
    hours: input.hours,
    address: input.address,
    notes: input.notes,
  })

  if (
    !input.gemachId ||
    !input.gemachName.trim() ||
    !input.category.trim() ||
    !submittedByContact ||
    (!input.claimsOperator && !hasGemachUpdateChanges(changes))
  ) {
    return { ok: false, error: 'invalid' }
  }

  const payload = serializeGemachUpdateRequest({
    kind: 'gemach_update',
    gemachId: input.gemachId,
    gemachSlug: input.gemachSlug || null,
    claimsOperator: input.claimsOperator,
    changes,
  })

  if (payload.length > 1000) {
    return { ok: false, error: 'invalid' }
  }

  const ipHash = await getClientIpHash()
  const supabase = anonClient()
  const { error } = await supabase.rpc('submit_suggestion', {
    p_gemach_name: `[Update] ${input.gemachName.trim().slice(0, 100)}`,
    p_category: input.category.trim().slice(0, 80),
    p_description: payload,
    p_contact_info: submittedByContact,
    p_submitted_by: input.submittedBy ? input.submittedBy.trim().slice(0, 120) : null,
    p_ip_hash: ipHash,
  })

  if (error) {
    if (isRateLimitError(error)) return { ok: false, error: 'rate_limited' }
    console.error('submitGemachUpdateAction error:', error)
    return { ok: false, error: 'unknown' }
  }

  return { ok: true }
}
