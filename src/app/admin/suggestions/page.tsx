import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { adminLogout, approveSuggestion, deleteSuggestion, isAdmin } from '../actions'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Suggestions - Admin',
  robots: { index: false, follow: false },
}

interface SuggestionRow {
  id: string
  gemach_name: string
  category: string
  description: string
  contact_info: string
  submitted_by: string | null
  created_at: string
}

async function getSuggestions(): Promise<SuggestionRow[]> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceKey) return []
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
  return (data || []) as SuggestionRow[]
}

export default async function AdminSuggestionsPage() {
  if (!(await isAdmin())) redirect('/admin')
  const suggestions = await getSuggestions()

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy">Suggestions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {suggestions.length} pending {suggestions.length === 1 ? 'submission' : 'submissions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/gemachs"
            className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-1.5 rounded-lg border border-slate-200 hover:border-navy transition-colors"
          >
            Gemachs
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

      {suggestions.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No pending suggestions.</div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s) => (
            <details
              key={s.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-navy truncate">
                    {s.gemach_name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{s.category}</span>
                    <span>·</span>
                    <span>{new Date(s.created_at).toLocaleDateString()}</span>
                    {s.submitted_by && (
                      <>
                        <span>·</span>
                        <span>by {s.submitted_by}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400">Expand</span>
              </summary>

              <div className="border-t border-slate-200 p-4 bg-slate-50/50 space-y-4">
                <div className="text-sm text-slate-700">
                  <div className="font-semibold text-slate-500 text-xs uppercase mb-1">Description</div>
                  <p className="whitespace-pre-wrap">{s.description}</p>
                </div>
                <div className="text-sm text-slate-700">
                  <div className="font-semibold text-slate-500 text-xs uppercase mb-1">Contact Info (raw)</div>
                  <p className="whitespace-pre-wrap break-words">{s.contact_info}</p>
                </div>

                <form
                  action={approveSuggestion.bind(null, s.id)}
                  className="space-y-3 pt-3 border-t border-slate-200"
                >
                  <div className="text-xs font-bold text-navy uppercase tracking-wider">Approve &amp; publish</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Name
                      <input
                        name="name"
                        defaultValue={s.gemach_name}
                        required
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Category
                      <select
                        name="category"
                        defaultValue={s.category}
                        required
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-slate-500">
                    Description
                    <textarea
                      name="description"
                      defaultValue={s.description}
                      required
                      rows={2}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Location
                      <select
                        name="location"
                        required
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal bg-white"
                      >
                        <option value="">-- pick a town --</option>
                        {LOCATIONS.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Hours
                      <input
                        name="hours"
                        placeholder="Sun-Thu 9am-8pm"
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="text-xs font-semibold text-slate-500">
                      Phone
                      <input
                        name="contact_phone"
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Email
                      <input
                        name="contact_email"
                        type="email"
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                      />
                    </label>
                    <label className="text-xs font-semibold text-slate-500">
                      Website
                      <input
                        name="contact_website"
                        type="url"
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-colors"
                    >
                      Approve &amp; publish
                    </button>
                    <button
                      type="submit"
                      formAction={deleteSuggestion.bind(null, s.id)}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Reject
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
