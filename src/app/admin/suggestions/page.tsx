import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  adminLogout,
  applyGemachUpdate,
  approveSuggestion,
  deleteSuggestion,
  isAdmin,
} from '../actions'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import {
  listGemachUpdateChanges,
  parseGemachUpdateRequest,
} from '@/lib/gemachUpdateRequests'

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

interface GemachStub {
  id: string
  name: string
  slug: string | null
  location: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  contact_website: string | null
  hours: string | null
  address: string | null
  notes: string | null
  operator_confirmed: boolean
}

function serviceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function getSuggestions(): Promise<SuggestionRow[]> {
  const supabase = serviceClient()
  if (!supabase) return []
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
  const parsedRows = suggestions.map((row) => ({
    row,
    update: parseGemachUpdateRequest(row.description),
  }))

  const updateIds = Array.from(
    new Set(
      parsedRows
        .map((item) => item.update?.gemachId)
        .filter((id): id is string => Boolean(id))
    )
  )

  const supabase = serviceClient()
  const { data: gemachs } =
    supabase && updateIds.length > 0
      ? await supabase
          .from('gemachs')
          .select('id, name, slug, location, contact_name, contact_phone, contact_email, contact_website, hours, address, notes, operator_confirmed')
          .in('id', updateIds)
      : { data: [] }

  const gemachById = new Map<string, GemachStub>()
  for (const gemach of (gemachs || []) as GemachStub[]) {
    gemachById.set(gemach.id, gemach)
  }

  const updateRequests = parsedRows
    .filter(
      (
        item
      ): item is {
        row: SuggestionRow
        update: Exclude<ReturnType<typeof parseGemachUpdateRequest>, null>
      } => item.update !== null
    )
    .map(({ row, update }) => ({
      row,
      update,
      target: gemachById.get(update.gemachId) || null,
      changes: listGemachUpdateChanges(update.changes),
    }))

  const newSuggestions = parsedRows
    .filter((item) => !item.update)
    .map((item) => item.row)

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
            Suggestions & updates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {updateRequests.length} update request{updateRequests.length === 1 ? '' : 's'} and{' '}
            {newSuggestions.length} new submission{newSuggestions.length === 1 ? '' : 's'}
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

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy">Listing updates</h2>
          <p className="text-sm text-slate-500 mt-1">
            Corrections and operator-submitted updates waiting for review.
          </p>
        </div>

        {updateRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 rounded-xl border border-slate-200 bg-white">
            No pending update requests.
          </div>
        ) : (
          <div className="space-y-4">
            {updateRequests.map(({ row, update, target, changes }) => (
              <details
                key={row.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none hover:bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <div className="font-heading font-bold text-navy truncate">
                      {target?.name || row.gemach_name.replace(/^\[Update\]\s*/, '')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{target?.location || 'Listing not found'}</span>
                      <span>·</span>
                      <span>{changes.length} change{changes.length === 1 ? '' : 's'}</span>
                      <span>·</span>
                      <span>{new Date(row.created_at).toLocaleDateString()}</span>
                      {row.submitted_by && (
                        <>
                          <span>·</span>
                          <span>by {row.submitted_by}</span>
                        </>
                      )}
                      {update.claimsOperator && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold">claims operator access</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Expand</span>
                </summary>

                <div className="border-t border-slate-200 p-4 bg-slate-50/50 space-y-4">
                  {row.contact_info && (
                    <div className="text-sm text-slate-700">
                      <div className="font-semibold text-slate-500 text-xs uppercase mb-1">
                        Submitter contact
                      </div>
                      <p className="whitespace-pre-wrap break-words">{row.contact_info}</p>
                    </div>
                  )}

                  {!target ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      The original gemach could not be found. Reject this request or inspect the data manually before re-creating it.
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {changes.map((change) => (
                          <div key={change.field} className="rounded-lg border border-slate-200 bg-white p-3">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                              {change.label}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 text-sm">
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                  Current
                                </div>
                                <div className="text-slate-600 whitespace-pre-wrap break-words">
                                  {(target[change.field] || 'Not listed') as string}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                  Proposed
                                </div>
                                <div className="text-slate-800 whitespace-pre-wrap break-words">
                                  {change.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form
                        action={applyGemachUpdate.bind(null, row.id)}
                        className="space-y-3 pt-3 border-t border-slate-200"
                      >
                        <div className="text-xs font-bold text-navy uppercase tracking-wider">
                          Approve and apply
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {changes.map((change) => (
                            <label key={change.field} className="text-xs font-semibold text-slate-500">
                              {change.label}
                              {change.field === 'notes' ? (
                                <textarea
                                  name={change.field}
                                  defaultValue={change.value}
                                  rows={3}
                                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                                />
                              ) : (
                                <input
                                  name={change.field}
                                  defaultValue={change.value}
                                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 font-normal"
                                />
                              )}
                            </label>
                          ))}
                        </div>

                        <label className="flex items-start gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name="operator_confirmed"
                            defaultChecked={update.claimsOperator || target.operator_confirmed}
                            className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          />
                          <span>Mark this gemach as operator-confirmed</span>
                        </label>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-bold hover:bg-navy-deep transition-colors"
                          >
                            Apply update
                          </button>
                          <button
                            type="submit"
                            formAction={deleteSuggestion.bind(null, row.id)}
                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy">New gemach suggestions</h2>
          <p className="text-sm text-slate-500 mt-1">
            Community submissions for listings that are not in the directory yet.
          </p>
        </div>

        {newSuggestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 rounded-xl border border-slate-200 bg-white">
            No pending gemach suggestions.
          </div>
        ) : (
          <div className="space-y-4">
            {newSuggestions.map((s) => (
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
      </section>
    </main>
  )
}
