import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { adminLogout, isAdmin, toggleOperatorConfirmed } from '../actions'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji } from '@/lib/constants'
import { BadgeCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gemachs - Admin',
  robots: { index: false, follow: false },
}

async function getGemachs(): Promise<Gemach[]> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceKey) return []
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .order('operator_confirmed', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('Error fetching gemachs:', error)
    return []
  }
  return (data || []) as Gemach[]
}

async function toggleAction(id: string, next: boolean) {
  'use server'
  await toggleOperatorConfirmed(id, next)
}

export default async function AdminGemachsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  if (!(await isAdmin())) redirect('/admin')
  const { q, filter } = await searchParams
  const all = await getGemachs()

  const query = (q || '').trim().toLowerCase()
  const filtered = all.filter((g) => {
    if (filter === 'unconfirmed' && g.operator_confirmed) return false
    if (filter === 'confirmed' && !g.operator_confirmed) return false
    if (!query) return true
    return (
      g.name.toLowerCase().includes(query) ||
      g.location.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query) ||
      (g.contact_phone || '').toLowerCase().includes(query) ||
      (g.contact_email || '').toLowerCase().includes(query)
    )
  })

  const confirmedCount = all.filter((g) => g.operator_confirmed).length
  const activeFilter = filter || 'all'

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy">Gemachs</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-semibold text-navy">{confirmedCount}</span> of {all.length} confirmed by operator
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/suggestions"
            className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors"
          >
            Suggestions
          </a>
          <a
            href="/admin/reports"
            className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors"
          >
            Reports
          </a>
          <form action={adminLogout}>
            <button className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <form method="get" className="flex flex-wrap items-center gap-2 mb-5">
        <input
          name="q"
          defaultValue={q || ''}
          placeholder="Search name, town, category, phone..."
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-navy"
        />
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
          {[
            { key: 'all', label: 'All' },
            { key: 'unconfirmed', label: 'Not confirmed' },
            { key: 'confirmed', label: 'Confirmed' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="submit"
              name="filter"
              value={opt.key}
              className={`px-3 py-2 transition-colors ${
                activeFilter === opt.key
                  ? 'bg-navy text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </form>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No gemachs match.</div>
      ) : (
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {filtered.map((g) => (
            <div key={g.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-heading font-bold text-navy truncate">{g.name}</span>
                  {g.operator_confirmed && (
                    <BadgeCheck className="w-4 h-4 text-sky-500 shrink-0" strokeWidth={2.25} />
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{getCategoryEmoji(g.category)} {g.category}</span>
                  <span>·</span>
                  <span>{g.location}</span>
                  {g.contact_phone && (
                    <>
                      <span>·</span>
                      <span>{g.contact_phone}</span>
                    </>
                  )}
                </div>
              </div>

              <form action={toggleAction.bind(null, g.id, !g.operator_confirmed)}>
                <button
                  type="submit"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    g.operator_confirmed
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-sky-500 text-white hover:bg-sky-600'
                  }`}
                >
                  {g.operator_confirmed ? 'Remove checkmark' : 'Mark confirmed'}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
