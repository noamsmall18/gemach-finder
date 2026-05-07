import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  EyeOff,
  Inbox,
  ListChecks,
  LogOut,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  adminLogin,
  adminLogout,
  deleteWishlistItem,
  isAdmin,
  updateWishlistStatus,
} from './actions'
import { parseGemachUpdateRequest } from '@/lib/gemachUpdateRequests'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin - GemachFinder',
  robots: { index: false, follow: false },
}

interface SuggestionRow {
  id: string
  gemach_name: string
  category: string
  description: string
  submitted_by: string | null
  created_at: string
}

interface GemachAdminRow {
  id: string
  name: string
  slug: string | null
  category: string
  location: string
  verified: boolean
  operator_confirmed: boolean
  used_count: number | null
  report_count: number | null
  priority: number | null
  created_at: string
}

interface ReportRow {
  id: string
  gemach_id: string
  reason: string | null
  created_at: string
  resolved: boolean
}

interface WishlistRow {
  id: string
  name: string
  category: string
  description: string | null
  requested_by: string | null
  vote_count: number
  status: 'open' | 'fulfilled'
  created_at: string
}

function serviceClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

async function getDashboardData() {
  const sc = serviceClient()
  if (!sc) {
    return {
      serviceConfigured: false,
      suggestions: [],
      gemachs: [],
      reports: [],
      wishlist: [],
      pendingUpdates: [],
      pendingNewListings: [],
      openRequests: [],
      hiddenGemachs: [],
      unconfirmedGemachs: [],
    }
  }

  const [suggestionsResult, gemachsResult, reportsResult, wishlistResult] = await Promise.all([
    sc
      .from('suggestions')
      .select('id, gemach_name, category, description, submitted_by, created_at')
      .order('created_at', { ascending: false }),
    sc
      .from('gemachs')
      .select('id, name, slug, category, location, verified, operator_confirmed, used_count, report_count, priority, created_at')
      .order('verified', { ascending: true })
      .order('operator_confirmed', { ascending: true })
      .order('priority', { ascending: false }),
    sc
      .from('gemach_reports')
      .select('id, gemach_id, reason, created_at, resolved')
      .eq('resolved', false)
      .order('created_at', { ascending: false }),
    sc
      .from('wishlist_items')
      .select('id, name, category, description, requested_by, vote_count, status, created_at')
      .order('status', { ascending: true })
      .order('vote_count', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  const suggestions = (suggestionsResult.data || []) as SuggestionRow[]
  const gemachs = (gemachsResult.data || []) as GemachAdminRow[]
  const reports = (reportsResult.data || []) as ReportRow[]
  const wishlist = (wishlistResult.data || []) as WishlistRow[]

  const pendingUpdates = suggestions.filter((row) => parseGemachUpdateRequest(row.description))
  const pendingNewListings = suggestions.filter((row) => !parseGemachUpdateRequest(row.description))
  const openRequests = wishlist.filter((item) => item.status === 'open')
  const hiddenGemachs = gemachs.filter((gemach) => !gemach.verified)
  const unconfirmedGemachs = gemachs.filter((gemach) => !gemach.operator_confirmed)

  return {
    serviceConfigured: true,
    suggestions,
    gemachs,
    reports,
    wishlist,
    pendingUpdates,
    pendingNewListings,
    openRequests,
    hiddenGemachs,
    unconfirmedGemachs,
  }
}

function LoginForm({ error }: { error?: string }) {
  return (
    <main className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-heading text-3xl font-bold text-navy mb-2">Admin</h1>
      <p className="text-sm text-slate-500 mb-6">Enter the admin password to manage GemachFinder.</p>

      <form action={adminLogin} className="space-y-3">
        <input
          name="password"
          type="password"
          autoFocus
          required
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 text-sm"
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">Incorrect password.</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-navy text-white rounded-xl font-bold hover:bg-navy-deep transition-colors text-sm"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}

function StatTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: ReactNode
  tone: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className={`w-9 h-9 rounded-lg ${tone} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function AdminLink({
  href,
  title,
  body,
  icon,
}: {
  href: string
  title: string
  body: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 bg-white p-4 hover:border-navy/30 hover:shadow-sm transition-all flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 text-navy flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-bold text-navy">{title}</h2>
          <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
        </div>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{body}</p>
      </div>
    </Link>
  )
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  if (!(await isAdmin())) return <LoginForm error={error} />

  const {
    suggestions,
    gemachs,
    reports,
    serviceConfigured,
    pendingUpdates,
    pendingNewListings,
    openRequests,
    hiddenGemachs,
    unconfirmedGemachs,
  } = await getDashboardData()

  const publishedGemachs = gemachs.length - hiddenGemachs.length
  const totalVotes = openRequests.reduce((sum, item) => sum + item.vote_count, 0)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">GemachFinder admin</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy mt-1">
            Command center
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Review missing-gemach requests, publish submissions, resolve reports, and control what appears in the public community directory.
          </p>
        </div>
        <form action={adminLogout}>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:text-navy hover:border-navy transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </form>
      </div>

      {!serviceConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold">Local admin password is working, but live admin data is not configured.</div>
            <p className="mt-1">
              Add <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> to <span className="font-mono">.env.local</span> to manage listings, requests, reports, and sessions from localhost.
            </p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatTile
          label="Published gemachs"
          value={publishedGemachs}
          icon={<BadgeCheck className="w-4 h-4" />}
          tone="bg-sky-50 text-sky-700"
        />
        <StatTile
          label="Hidden from community"
          value={hiddenGemachs.length}
          icon={<EyeOff className="w-4 h-4" />}
          tone="bg-slate-100 text-slate-700"
        />
        <StatTile
          label="Pending submissions"
          value={suggestions.length}
          icon={<Inbox className="w-4 h-4" />}
          tone="bg-amber-50 text-amber-700"
        />
        <StatTile
          label="Open reports"
          value={reports.length}
          icon={<AlertTriangle className="w-4 h-4" />}
          tone="bg-rose-50 text-rose-700"
        />
        <StatTile
          label="Request votes"
          value={totalVotes}
          icon={<Sparkles className="w-4 h-4" />}
          tone="bg-emerald-50 text-emerald-700"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <AdminLink
          href="/admin/suggestions"
          title="Suggestions"
          body={`${pendingNewListings.length} new listings and ${pendingUpdates.length} listing updates waiting for review.`}
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <AdminLink
          href="/admin/gemachs"
          title="Gemachs"
          body={`${gemachs.length} total records. Edit listing details, publish or hide entries, and manage operator confirmations.`}
          icon={<Search className="w-4 h-4" />}
        />
        <AdminLink
          href="/admin/reports"
          title="Reports"
          body={`${reports.length} unresolved public report${reports.length === 1 ? '' : 's'} need a look.`}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </section>

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold text-navy">Community requests</h2>
              <p className="text-sm text-slate-500 mt-1">
                Missing gemachs people want added. Mark fulfilled once the need is covered.
              </p>
            </div>
            <Link href="/requests" className="text-xs font-bold text-slate-500 hover:text-navy">
              Public view
            </Link>
          </div>

          {openRequests.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No open community requests.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden">
              {openRequests.slice(0, 8).map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-slate-900">{item.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                        {item.vote_count} vote{item.vote_count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-1.5">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{formatDate(item.created_at)}</span>
                      {item.requested_by && (
                        <>
                          <span>·</span>
                          <span>by {item.requested_by}</span>
                        </>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-1.5 shrink-0">
                    <form action={updateWishlistStatus.bind(null, item.id, 'fulfilled')}>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Fulfilled
                      </button>
                    </form>
                    <form action={deleteWishlistItem.bind(null, item.id)}>
                      <button className="px-2.5 py-1.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy">Needs attention</h2>
            <p className="text-sm text-slate-500 mt-1">Fast links into the queues that keep the directory clean.</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-200 overflow-hidden">
            <Link href="/admin/suggestions" className="p-4 flex items-center gap-3 hover:bg-slate-50">
              <Inbox className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-slate-700 flex-1">Pending submissions</span>
              <span className="text-sm font-bold text-navy tabular-nums">{suggestions.length}</span>
            </Link>
            <Link href="/admin/gemachs?filter=hidden" className="p-4 flex items-center gap-3 hover:bg-slate-50">
              <EyeOff className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 flex-1">Hidden gemachs</span>
              <span className="text-sm font-bold text-navy tabular-nums">{hiddenGemachs.length}</span>
            </Link>
            <Link href="/admin/gemachs?filter=unconfirmed" className="p-4 flex items-center gap-3 hover:bg-slate-50">
              <ListChecks className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-700 flex-1">Not operator-confirmed</span>
              <span className="text-sm font-bold text-navy tabular-nums">{unconfirmedGemachs.length}</span>
            </Link>
            <Link href="/admin/reports" className="p-4 flex items-center gap-3 hover:bg-slate-50">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-semibold text-slate-700 flex-1">Unresolved reports</span>
              <span className="text-sm font-bold text-navy tabular-nums">{reports.length}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
