'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

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
  const supabase = anonClient()
  await supabase.from('gemach_reports').insert({ gemach_id: gemachId, reason: trimmed || null })
  const sc = serviceClient()
  const { data: row } = await sc.from('gemachs').select('report_count').eq('id', gemachId).maybeSingle()
  const next = (row?.report_count ?? 0) + 1
  await sc.from('gemachs').update({ report_count: next }).eq('id', gemachId)
  revalidatePath(`/g/${slug}`)
  return { ok: true }
}
