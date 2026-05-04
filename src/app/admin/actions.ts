'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import {
  GEMACH_UPDATE_FIELDS,
  GEMACH_UPDATE_FIELD_LIMITS,
  parseGemachUpdateRequest,
} from '@/lib/gemachUpdateRequests'
import { townToSlug } from '@/lib/data'

const ADMIN_COOKIE = 'gemach_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceKey) {
    throw new Error('Supabase service role env vars are missing')
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// Compares SHA-256 hashes of both strings so the comparison runs in constant
// time regardless of where the first differing byte sits.
function passwordMatches(input: string, expected: string): boolean {
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function adminLogin(formData: FormData) {
  const password = String(formData.get('password') || '')
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    throw new Error('ADMIN_PASSWORD env var not set')
  }
  if (!passwordMatches(password, expected)) {
    redirect('/admin?error=1')
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString()
  const sc = getServiceClient()
  const { error } = await sc.from('admin_sessions').insert({ token, expires_at: expiresAt })
  if (error) throw error

  const store = await cookies()
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  redirect('/admin/suggestions')
}

export async function adminLogout() {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (token) {
    const sc = getServiceClient()
    await sc.from('admin_sessions').delete().eq('token', token)
  }
  store.delete(ADMIN_COOKIE)
  redirect('/admin')
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return false
  const sc = getServiceClient()
  const { data } = await sc
    .from('admin_sessions')
    .select('expires_at')
    .eq('token', token)
    .maybeSingle()
  if (!data) return false
  return new Date(data.expires_at).getTime() > Date.now()
}

export async function deleteSuggestion(id: string) {
  if (!(await isAdmin())) redirect('/admin')
  const supabase = getServiceClient()
  const { error } = await supabase.from('suggestions').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/suggestions')
}

export async function toggleOperatorConfirmed(id: string, next: boolean) {
  if (!(await isAdmin())) redirect('/admin')
  const supabase = getServiceClient()
  const { error } = await supabase
    .from('gemachs')
    .update({ operator_confirmed: next })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/admin/gemachs')
  revalidatePath('/')
  revalidatePath('/v2')
}

function revalidateGemachPages(slug: string | null, location: string) {
  revalidatePath('/')
  revalidatePath('/map')
  revalidatePath('/v2')
  revalidatePath('/v2/map')
  revalidatePath(`/town/${townToSlug(location)}`)
  if (slug) revalidatePath(`/g/${slug}`)
}

export async function approveSuggestion(id: string, formData: FormData) {
  if (!(await isAdmin())) redirect('/admin')
  const supabase = getServiceClient()

  const name = String(formData.get('name') || '').trim()
  const category = String(formData.get('category') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const location = String(formData.get('location') || '').trim()
  const contact_phone = String(formData.get('contact_phone') || '').trim() || null
  const contact_email = String(formData.get('contact_email') || '').trim() || null
  const contact_website = String(formData.get('contact_website') || '').trim() || null
  const hours = String(formData.get('hours') || '').trim() || null

  if (!name || !category || !description || !location) {
    throw new Error('name, category, description, and location are required')
  }

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  let slug = baseSlug
  for (let n = 2; n < 50; n++) {
    const { data: existing } = await supabase
      .from('gemachs')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!existing) break
    slug = `${baseSlug}-${n}`
  }

  const { error: insertError } = await supabase.from('gemachs').insert({
    name,
    category,
    description,
    location,
    contact_phone,
    contact_email,
    contact_website,
    hours,
    slug,
    verified: true,
    priority: 0,
  })
  if (insertError) throw insertError

  const { error: deleteError } = await supabase.from('suggestions').delete().eq('id', id)
  if (deleteError) throw deleteError

  revalidatePath('/admin/suggestions')
  revalidatePath('/')
}

export async function applyGemachUpdate(id: string, formData: FormData) {
  if (!(await isAdmin())) redirect('/admin')
  const supabase = getServiceClient()

  const { data: requestRow, error: requestError } = await supabase
    .from('suggestions')
    .select('id, description')
    .eq('id', id)
    .maybeSingle()

  if (requestError) throw requestError
  if (!requestRow) throw new Error('Update request not found')

  const parsed = parseGemachUpdateRequest(requestRow.description)
  if (!parsed) throw new Error('Suggestion is not a gemach update request')

  const updates: Record<string, string | boolean> = {}

  for (const field of GEMACH_UPDATE_FIELDS) {
    const nextValue = String(formData.get(field) || '').trim()
    if (nextValue) {
      updates[field] = nextValue.slice(0, GEMACH_UPDATE_FIELD_LIMITS[field])
    }
  }

  if (formData.get('operator_confirmed') === 'on') {
    updates.operator_confirmed = true
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No approved changes were provided')
  }

  const { data: updatedGemach, error: updateError } = await supabase
    .from('gemachs')
    .update(updates)
    .eq('id', parsed.gemachId)
    .select('slug, location')
    .maybeSingle()

  if (updateError) throw updateError
  if (!updatedGemach) throw new Error('Gemach for update request was not found')

  const { error: deleteError } = await supabase.from('suggestions').delete().eq('id', id)
  if (deleteError) throw deleteError

  revalidatePath('/admin/suggestions')
  revalidateGemachPages(updatedGemach.slug, updatedGemach.location)
}
