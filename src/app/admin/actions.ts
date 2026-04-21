'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE = 'gemach_admin'
const COOKIE_TTL = 60 * 60 * 24 * 7

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

export async function adminLogin(formData: FormData) {
  const password = String(formData.get('password') || '')
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    throw new Error('ADMIN_PASSWORD env var not set')
  }
  if (password !== expected) {
    redirect('/admin?error=1')
  }
  const store = await cookies()
  store.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: COOKIE_TTL,
  })
  redirect('/admin/suggestions')
}

export async function adminLogout() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/admin')
}

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === expected
}

export async function deleteSuggestion(id: string) {
  if (!(await isAdmin())) redirect('/admin')
  const supabase = getServiceClient()
  const { error } = await supabase.from('suggestions').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/suggestions')
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

  const { error: insertError } = await supabase.from('gemachs').insert({
    name,
    category,
    description,
    location,
    contact_phone,
    contact_email,
    contact_website,
    hours,
    verified: true,
    priority: 0,
  })
  if (insertError) throw insertError

  const { error: deleteError } = await supabase.from('suggestions').delete().eq('id', id)
  if (deleteError) throw deleteError

  revalidatePath('/admin/suggestions')
  revalidatePath('/')
}
