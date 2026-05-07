import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Search,
  TrendingUp,
} from 'lucide-react'
import {
  adminLogout,
  isAdmin,
  toggleGemachVerified,
  toggleOperatorConfirmed,
  updateGemach,
} from '../actions'
import type { Gemach } from '@/lib/types'
import { CATEGORIES, LOCATIONS, getCategoryEmoji } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gemachs - Admin',
  robots: { index: false, follow: false },
}

async function getGemachs(): Promise<{ rows: Gemach[]; serviceConfigured: boolean }> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceKey) return { rows: [], serviceConfigured: false }
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase
    .from('gemachs')
    .select('*')
    .order('verified', { ascending: true })
    .order('operator_confirmed', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.error('Error fetching gemachs:', error)
    return { rows: [], serviceConfigured: true }
  }
  return { rows: (data || []) as Gemach[], serviceConfigured: true }
}

function inputClass(extra = '') {
  return `mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal outline-none focus:border-navy ${extra}`
}

function optionalLocationOptions(current: string) {
  return LOCATIONS.includes(current as (typeof LOCATIONS)[number])
    ? LOCATIONS
    : ([current, ...LOCATIONS] as readonly string[])
}

function optionalCategoryOptions(current: string) {
  const categoryNames = CATEGORIES.map((category) => category.name) as readonly string[]
  return categoryNames.includes(current)
    ? categoryNames
    : [current, ...categoryNames]
}

export default async function AdminGemachsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  if (!(await isAdmin())) redirect('/admin')
  const { q, filter } = await searchParams
  const { rows: all, serviceConfigured } = await getGemachs()

  const query = (q || '').trim().toLowerCase()
  const activeFilter = filter || 'all'
  const filtered = all.filter((g) => {
    if (activeFilter === 'hidden' && g.verified) return false
    if (activeFilter === 'published' && !g.verified) return false
    if (activeFilter === 'unconfirmed' && g.operator_confirmed) return false
    if (activeFilter === 'confirmed' && !g.operator_confirmed) return false
    if (activeFilter === 'reported' && (g.report_count ?? 0) <= 0) return false
    if (!query) return true
    return [
      g.name,
      g.location,
      g.category,
      g.description,
      g.contact_name,
      g.contact_phone,
      g.contact_email,
      g.contact_website,
      g.address,
      g.notes,
      g.slug,
    ].some((value) => value?.toLowerCase().includes(query))
  })

  const publishedCount = all.filter((g) => g.verified).length
  const confirmedCount = all.filter((g) => g.operator_confirmed).length
  const hiddenCount = all.length - publishedCount

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-navy">
            Admin
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy mt-1">Gemachs</h1>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-semibold text-navy">{publishedCount}</span> published,{' '}
            <span className="font-semibold text-navy">{hiddenCount}</span> hidden,{' '}
            <span className="font-semibold text-navy">{confirmedCount}</span> operator-confirmed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/suggestions"
            className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors"
          >
            Suggestions
          </Link>
          <Link
            href="/admin/reports"
            className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors"
          >
            Reports
          </Link>
          <form action={adminLogout}>
            <button className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <form method="get" className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            name="q"
            defaultValue={q || ''}
            placeholder="Search name, town, category, contact, slug..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-navy"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {[
            { key: 'all', label: 'All' },
            { key: 'published', label: 'Published' },
            { key: 'hidden', label: 'Hidden' },
            { key: 'unconfirmed', label: 'Not confirmed' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'reported', label: 'Reported' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="submit"
              name="filter"
              value={opt.key}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                activeFilter === opt.key
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-navy'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </form>

      {!serviceConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> to{' '}
          <span className="font-mono">.env.local</span> to edit live gemach listings from localhost.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 rounded-lg border border-slate-200 bg-white">
          No gemachs match.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => (
            <details key={g.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer list-none">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-heading font-bold text-navy truncate">{g.name}</span>
                    {g.verified ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <Eye className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                      </span>
                    )}
                    {g.operator_confirmed && (
                      <BadgeCheck className="w-4 h-4 text-sky-500 shrink-0" strokeWidth={2.25} />
                    )}
                    {(g.used_count ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-semibold tabular-nums">
                        <TrendingUp className="w-3 h-3" strokeWidth={2.25} />
                        {g.used_count}
                      </span>
                    )}
                    {(g.report_count ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold tabular-nums">
                        <AlertTriangle className="w-3 h-3" strokeWidth={2.25} />
                        {g.report_count}
                      </span>
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

                <span className="text-xs font-semibold text-slate-400 shrink-0">Manage</span>
              </summary>

              <div className="border-t border-slate-200 bg-slate-50/60 p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {g.slug && (
                    <Link
                      href={`/g/${g.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:text-navy hover:border-navy transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Public page
                    </Link>
                  )}
                  <form action={toggleGemachVerified.bind(null, g.id, !g.verified)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        g.verified
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {g.verified ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {g.verified ? 'Hide from community' : 'Publish to community'}
                    </button>
                  </form>
                  <form action={toggleOperatorConfirmed.bind(null, g.id, !g.operator_confirmed)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        g.operator_confirmed
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {g.operator_confirmed ? 'Remove operator check' : 'Mark operator-confirmed'}
                    </button>
                  </form>
                </div>

                <form action={updateGemach.bind(null, g.id)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Name
                      <input name="name" defaultValue={g.name} required className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Slug
                      <input name="slug" defaultValue={g.slug || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Category
                      <select name="category" defaultValue={g.category} required className={inputClass('bg-white')}>
                        {optionalCategoryOptions(g.category).map((category) => (
                          <option key={category} value={category}>
                            {getCategoryEmoji(category)} {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Location
                      <select name="location" defaultValue={g.location} required className={inputClass('bg-white')}>
                        {optionalLocationOptions(g.location).map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-slate-500">
                    Description
                    <textarea
                      name="description"
                      defaultValue={g.description}
                      required
                      rows={3}
                      className={inputClass('resize-y')}
                    />
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Contact name
                      <input name="contact_name" defaultValue={g.contact_name || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Phone
                      <input name="contact_phone" defaultValue={g.contact_phone || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Email
                      <input name="contact_email" type="email" defaultValue={g.contact_email || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Website
                      <input name="contact_website" type="url" defaultValue={g.contact_website || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Hours
                      <input name="hours" defaultValue={g.hours || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Address
                      <input name="address" defaultValue={g.address || ''} className={inputClass()} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_9rem_9rem_7rem] gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Photo URL
                      <input name="photo_url" type="url" defaultValue={g.photo_url || ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Latitude
                      <input name="lat" inputMode="decimal" defaultValue={g.lat ?? ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Longitude
                      <input name="lng" inputMode="decimal" defaultValue={g.lng ?? ''} className={inputClass()} />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Priority
                      <input name="priority" type="number" defaultValue={g.priority ?? 0} className={inputClass()} />
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-slate-500">
                    Notes
                    <textarea name="notes" defaultValue={g.notes || ''} rows={3} className={inputClass('resize-y')} />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          name="verified"
                          defaultChecked={g.verified}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        Published in community
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          name="operator_confirmed"
                          defaultChecked={g.operator_confirmed}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Operator-confirmed
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  )
}
