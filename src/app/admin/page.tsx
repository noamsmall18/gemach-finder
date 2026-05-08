import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Database,
  ExternalLink,
  EyeOff,
  Inbox,
  ListChecks,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import {
  adminLogin,
  adminLogout,
  deleteWishlistItem,
  isAdmin,
  updateWishlistStatus,
} from './actions'
import { CATEGORIES, LOCATIONS, getCategoryEmoji } from '@/lib/constants'
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
  contact_phone: string | null
  contact_email: string | null
  contact_website: string | null
  lat: number | null
  lng: number | null
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

interface ActivityItem {
  id: string
  title: string
  detail: string
  href: string
  date: string
  icon: ReactNode
  tone: string
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

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ageLabel(value: string): string {
  const ageMs = Date.now() - new Date(value).getTime()
  const days = Math.max(0, Math.floor(ageMs / 86_400_000))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function percent(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

function plural(value: number, singular: string, pluralWord = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : pluralWord}`
}

function hasAnyContact(gemach: GemachAdminRow): boolean {
  return Boolean(gemach.contact_phone || gemach.contact_email || gemach.contact_website)
}

function hasCoordinates(gemach: GemachAdminRow): boolean {
  return typeof gemach.lat === 'number' && typeof gemach.lng === 'number'
}

async function getDashboardData() {
  const sc = serviceClient()
  if (!sc) {
    return {
      serviceConfigured: false,
      fetchErrors: [],
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
      .select(
        'id, name, slug, category, location, verified, operator_confirmed, contact_phone, contact_email, contact_website, lat, lng, used_count, report_count, priority, created_at'
      )
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

  const fetchErrors = [
    suggestionsResult.error ? 'suggestions' : null,
    gemachsResult.error ? 'gemachs' : null,
    reportsResult.error ? 'reports' : null,
    wishlistResult.error ? 'community requests' : null,
  ].filter((value): value is string => Boolean(value))

  const suggestions = (suggestionsResult.data || []) as SuggestionRow[]
  const gemachs = (gemachsResult.data || []) as GemachAdminRow[]
  const reports = (reportsResult.data || []) as ReportRow[]
  const wishlist = (wishlistResult.data || []) as WishlistRow[]

  const parsedSuggestions = suggestions.map((row) => ({
    row,
    update: parseGemachUpdateRequest(row.description),
  }))
  const pendingUpdates = parsedSuggestions.filter((item) => item.update)
  const pendingNewListings = parsedSuggestions.filter((item) => !item.update)
  const openRequests = wishlist.filter((item) => item.status === 'open')
  const hiddenGemachs = gemachs.filter((gemach) => !gemach.verified)
  const unconfirmedGemachs = gemachs.filter((gemach) => !gemach.operator_confirmed)

  return {
    serviceConfigured: true,
    fetchErrors,
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
    <main className="min-h-[70vh] px-4 py-16">
      <section className="mx-auto max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">GemachFinder admin</p>
        <h1 className="mt-1 font-heading text-3xl font-bold text-navy">Sign in</h1>

        <form action={adminLogin} className="mt-6 space-y-3">
          <input
            name="password"
            type="password"
            autoFocus
            required
            placeholder="Password"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-navy px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-deep"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  )
}

function StatTile({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string
  value: number | string
  detail: string
  icon: ReactNode
  tone: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-bold tabular-nums text-slate-950">{value}</div>
          <div className="mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </div>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{detail}</p>
    </div>
  )
}

function QueueCard({
  title,
  count,
  detail,
  href,
  icon,
  tone,
  action,
}: {
  title: string
  count: number
  detail: string
  href: string
  icon: ReactNode
  tone: string
  action: string
}) {
  const active = count > 0
  return (
    <Link
      href={href}
      className={`group rounded-lg border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active ? 'border-slate-200 hover:border-navy/30' : 'border-slate-100 opacity-80 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-bold text-navy">{title}</h2>
            <span className="rounded-lg bg-slate-50 px-2 py-1 text-sm font-bold tabular-nums text-slate-900">
              {count}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-navy">
            {action}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{eyebrow}</p>
        )}
        <h2 className="font-heading text-xl font-bold text-navy">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function MetricBar({
  label,
  value,
  total,
  tone,
}: {
  label: string
  value: number
  total: number
  tone: string
}) {
  const width = percent(value, total)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold tabular-nums text-slate-900">
          {value}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50"
    >
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="font-semibold text-slate-900">{item.title}</p>
          <span className="text-xs font-semibold text-slate-400">{ageLabel(item.date)}</span>
        </div>
        <p className="mt-0.5 break-words text-sm text-slate-500">{item.detail}</p>
      </div>
    </Link>
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
      className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-navy/30 hover:shadow-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-bold text-navy">{title}</h2>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{body}</p>
      </div>
    </Link>
  )
}

function TopCategoryRows({
  rows,
  total,
}: {
  rows: Array<{ name: string; count: number }>
  total: number
}) {
  return (
    <div className="divide-y divide-slate-100">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sea-soft text-sm">
            {getCategoryEmoji(row.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-semibold text-slate-800">{row.name}</span>
              <span className="font-bold tabular-nums text-navy">{row.count}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sea"
                style={{ width: `${percent(row.count, total)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
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
    fetchErrors,
    pendingUpdates,
    pendingNewListings,
    openRequests,
    hiddenGemachs,
    unconfirmedGemachs,
  } = await getDashboardData()

  const publishedGemachs = gemachs.length - hiddenGemachs.length
  const totalVotes = openRequests.reduce((sum, item) => sum + item.vote_count, 0)
  const confirmedGemachs = gemachs.length - unconfirmedGemachs.length
  const geocodedGemachs = gemachs.filter(hasCoordinates).length
  const missingContactGemachs = gemachs.filter((gemach) => !hasAnyContact(gemach))
  const reportedGemachs = gemachs.filter((gemach) => (gemach.report_count ?? 0) > 0)
  const priorityGemachs = gemachs.filter((gemach) => (gemach.priority ?? 0) > 0)
  const topRequest = openRequests[0]
  const newestSuggestion = suggestions[0]
  const newestReport = reports[0]
  const oldestReport = reports.at(-1)
  const urgentWork = reports.length + pendingUpdates.length + pendingNewListings.length
  const healthIssues =
    hiddenGemachs.length +
    unconfirmedGemachs.length +
    missingContactGemachs.length +
    reportedGemachs.length

  const categoryRows = CATEGORIES.map((category) => ({
    name: category.name,
    count: gemachs.filter((gemach) => gemach.category === category.name).length,
  }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const locationRows = LOCATIONS.map((location) => ({
    name: location,
    count: gemachs.filter((gemach) => gemach.location === location).length,
  }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const recentActivity: ActivityItem[] = [
    ...suggestions.map((row) => {
      const update = parseGemachUpdateRequest(row.description)
      return {
        id: `suggestion-${row.id}`,
        title: update ? 'Listing update' : 'New listing suggestion',
        detail: row.gemach_name,
        href: '/admin/suggestions',
        date: row.created_at,
        icon: update ? <ListChecks className="h-4 w-4" /> : <Inbox className="h-4 w-4" />,
        tone: update ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700',
      }
    }),
    ...reports.map((row) => ({
      id: `report-${row.id}`,
      title: 'Public report',
      detail: row.reason?.trim() || 'No reason given',
      href: '/admin/reports',
      date: row.created_at,
      icon: <AlertTriangle className="h-4 w-4" />,
      tone: 'bg-rose-50 text-rose-700',
    })),
    ...openRequests.map((row) => ({
      id: `request-${row.id}`,
      title: 'Community request',
      detail: `${row.name} - ${plural(row.vote_count, 'vote')}`,
      href: '/admin#community-requests',
      date: row.created_at,
      icon: <Sparkles className="h-4 w-4" />,
      tone: 'bg-emerald-50 text-emerald-700',
    })),
    ...gemachs.slice(0, 12).map((row) => ({
      id: `gemach-${row.id}`,
      title: row.verified ? 'Published listing' : 'Hidden listing',
      detail: row.name,
      href: '/admin/gemachs',
      date: row.created_at,
      icon: row.verified ? <BadgeCheck className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />,
      tone: row.verified ? 'bg-sea-soft text-navy' : 'bg-slate-100 text-slate-600',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const statusCopy =
    reports.length > 0
      ? `${plural(reports.length, 'report')} need review`
      : suggestions.length > 0
        ? `${plural(suggestions.length, 'submission')} waiting`
        : openRequests.length > 0
          ? `${plural(openRequests.length, 'community request')} open`
          : 'Queues are clear'

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <nav className="flex flex-wrap items-center gap-1 text-sm font-bold text-slate-500">
          <Link href="/admin" className="rounded-lg bg-navy px-3 py-2 text-white">
            Overview
          </Link>
          <Link href="/admin/suggestions" className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-navy">
            Suggestions
          </Link>
          <Link href="/admin/gemachs" className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-navy">
            Gemachs
          </Link>
          <Link href="/admin/reports" className="rounded-lg px-3 py-2 hover:bg-slate-50 hover:text-navy">
            Reports
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:border-navy hover:text-navy"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Public site
          </Link>
          <form action={adminLogout}>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:border-navy hover:text-navy">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                GemachFinder admin
              </p>
              <h1 className="mt-1 font-heading text-3xl font-bold text-navy sm:text-4xl">
                Command center
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {plural(urgentWork, 'urgent item')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <Database className="h-3.5 w-3.5" />
                  {plural(gemachs.length, 'record')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <Activity className="h-3.5 w-3.5" />
                  {statusCopy}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center">
              <div className="rounded-lg bg-white px-3 py-2">
                <div className="text-lg font-bold tabular-nums text-navy">{reports.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Reports
                </div>
              </div>
              <div className="rounded-lg bg-white px-3 py-2">
                <div className="text-lg font-bold tabular-nums text-navy">{suggestions.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Submissions
                </div>
              </div>
              <div className="rounded-lg bg-white px-3 py-2">
                <div className="text-lg font-bold tabular-nums text-navy">{openRequests.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Requests
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                serviceConfigured && fetchErrors.length === 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-navy">Admin status</h2>
              <p className="text-sm text-slate-500">
                {serviceConfigured ? 'Live data connected' : 'Local password only'}
              </p>
            </div>
          </div>
          {!serviceConfigured ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Add <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> to{' '}
              <span className="font-mono">.env.local</span> for live admin data.
            </p>
          ) : fetchErrors.length > 0 ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Check {fetchErrors.join(', ')} fetches before making live changes.
            </p>
          ) : (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Session, queues, listings, and community requests are readable.
            </p>
          )}
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Published"
          value={publishedGemachs}
          detail={`${percent(publishedGemachs, gemachs.length)}% of ${plural(gemachs.length, 'listing')}`}
          icon={<BadgeCheck className="h-4 w-4" />}
          tone="bg-sea-soft text-navy"
        />
        <StatTile
          label="Operator checks"
          value={`${percent(confirmedGemachs, gemachs.length)}%`}
          detail={`${plural(unconfirmedGemachs.length, 'listing')} still unconfirmed`}
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="bg-sky-50 text-sky-700"
        />
        <StatTile
          label="Public reports"
          value={reports.length}
          detail={oldestReport ? `Oldest open: ${formatDate(oldestReport.created_at)}` : 'No unresolved reports'}
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="bg-rose-50 text-rose-700"
        />
        <StatTile
          label="Request votes"
          value={totalVotes}
          detail={topRequest ? `${topRequest.name} leads with ${plural(topRequest.vote_count, 'vote')}` : 'No open request votes'}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="bg-emerald-50 text-emerald-700"
        />
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <QueueCard
          title="Reports"
          count={reports.length}
          detail={newestReport ? `${ageLabel(newestReport.created_at)}: ${newestReport.reason?.trim() || 'No reason given'}` : 'No public reports waiting.'}
          href="/admin/reports"
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="bg-rose-50 text-rose-700"
          action="Review reports"
        />
        <QueueCard
          title="Listing updates"
          count={pendingUpdates.length}
          detail={pendingUpdates.length > 0 ? 'Operator corrections and field updates.' : 'No corrections waiting.'}
          href="/admin/suggestions"
          icon={<ListChecks className="h-4 w-4" />}
          tone="bg-sky-50 text-sky-700"
          action="Review updates"
        />
        <QueueCard
          title="New submissions"
          count={pendingNewListings.length}
          detail={newestSuggestion ? `${newestSuggestion.gemach_name} submitted ${ageLabel(newestSuggestion.created_at).toLowerCase()}.` : 'No new listings waiting.'}
          href="/admin/suggestions"
          icon={<Inbox className="h-4 w-4" />}
          tone="bg-amber-50 text-amber-700"
          action="Approve listings"
        />
        <QueueCard
          title="Data hygiene"
          count={healthIssues}
          detail={`${plural(hiddenGemachs.length, 'hidden listing')} and ${plural(missingContactGemachs.length, 'missing contact')}.`}
          href="/admin/gemachs?filter=unconfirmed"
          icon={<ClipboardList className="h-4 w-4" />}
          tone="bg-slate-100 text-slate-700"
          action="Clean records"
        />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <SectionHeader
              eyebrow="Queue"
              title="Workboard"
              action={
                <Link
                  href="/admin/suggestions"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 hover:border-navy hover:text-navy"
                >
                  All queues
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
          </div>
          <div className="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                Directory health
              </h3>
              <div className="space-y-4">
                <MetricBar label="Published records" value={publishedGemachs} total={gemachs.length} tone="bg-navy" />
                <MetricBar label="Operator-confirmed" value={confirmedGemachs} total={gemachs.length} tone="bg-sky-500" />
                <MetricBar label="Map-ready records" value={geocodedGemachs} total={gemachs.length} tone="bg-emerald-500" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <Link
                  href="/admin/gemachs?filter=hidden"
                  className="rounded-lg border border-slate-200 p-3 hover:border-navy/30 hover:bg-slate-50"
                >
                  <div className="font-bold tabular-nums text-slate-900">{hiddenGemachs.length}</div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">Hidden</div>
                </Link>
                <Link
                  href="/admin/gemachs?filter=reported"
                  className="rounded-lg border border-slate-200 p-3 hover:border-navy/30 hover:bg-slate-50"
                >
                  <div className="font-bold tabular-nums text-slate-900">{reportedGemachs.length}</div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">Reported</div>
                </Link>
                <Link
                  href="/admin/gemachs?filter=unconfirmed"
                  className="rounded-lg border border-slate-200 p-3 hover:border-navy/30 hover:bg-slate-50"
                >
                  <div className="font-bold tabular-nums text-slate-900">{unconfirmedGemachs.length}</div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">Unconfirmed</div>
                </Link>
                <Link
                  href="/admin/gemachs"
                  className="rounded-lg border border-slate-200 p-3 hover:border-navy/30 hover:bg-slate-50"
                >
                  <div className="font-bold tabular-nums text-slate-900">{missingContactGemachs.length}</div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">No contact</div>
                </Link>
              </div>
            </div>

            <div className="p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                Recent activity
              </h3>
              {recentActivity.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                  No admin activity yet.
                </div>
              ) : (
                <div className="-mx-4 -mb-4">
                  {recentActivity.map((item) => (
                    <ActivityRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <SectionHeader eyebrow="Coverage" title="Category mix" />
            </div>
            {categoryRows.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No category data.</div>
            ) : (
              <TopCategoryRows rows={categoryRows} total={gemachs.length} />
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4">
              <SectionHeader eyebrow="Coverage" title="Town coverage" />
            </div>
            {locationRows.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No location data.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {locationRows.map((row) => (
                  <div key={row.name} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-semibold text-slate-800">{row.name}</span>
                        <span className="font-bold tabular-nums text-navy">{row.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${percent(row.count, gemachs.length)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div id="community-requests" className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <SectionHeader
              eyebrow="Community demand"
              title="Open requests"
              action={
                <Link href="/requests" className="text-xs font-bold text-slate-500 hover:text-navy">
                  Public view
                </Link>
              }
            />
          </div>

          {openRequests.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">No open community requests.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {openRequests.slice(0, 8).map((item, index) => (
                <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-start">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold tabular-nums text-emerald-700">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-slate-900">{item.name}</h3>
                      <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        {plural(item.vote_count, 'vote')}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-500">
                      <span>{item.category}</span>
                      <span>/</span>
                      <span>{formatDate(item.created_at)}</span>
                      {item.requested_by && (
                        <>
                          <span>/</span>
                          <span>by {item.requested_by}</span>
                        </>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 sm:flex-col">
                    <form action={updateWishlistStatus.bind(null, item.id, 'fulfilled')}>
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Fulfilled
                      </button>
                    </form>
                    <form action={deleteWishlistItem.bind(null, item.id)}>
                      <button className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeader eyebrow="Shortcuts" title="Fast paths" />
            <div className="mt-4 grid gap-3">
              <AdminLink
                href="/admin/gemachs#create-listing"
                title="Create listing"
                body="Add and publish a gemach directly from admin"
                icon={<Database className="h-4 w-4" />}
              />
              <AdminLink
                href="/admin/suggestions"
                title="Suggestions"
                body={`${pendingNewListings.length} new and ${pendingUpdates.length} updates waiting`}
                icon={<ClipboardList className="h-4 w-4" />}
              />
              <AdminLink
                href="/admin/gemachs"
                title="Gemachs"
                body={`${priorityGemachs.length} prioritized records, ${hiddenGemachs.length} hidden`}
                icon={<Search className="h-4 w-4" />}
              />
              <AdminLink
                href="/admin/reports"
                title="Reports"
                body={`${reports.length} unresolved public ${reports.length === 1 ? 'report' : 'reports'}`}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              <AdminLink
                href="#community-requests"
                title="Requests"
                body={`${openRequests.length} open community requests to fulfill or remove`}
                icon={<Sparkles className="h-4 w-4" />}
              />
              <AdminLink
                href="/v2/map"
                title="Public map"
                body={`${geocodedGemachs} listings currently have map coordinates`}
                icon={<MapPin className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeader eyebrow="Snapshot" title="Freshness" />
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Latest submission
                </span>
                <span className="font-semibold text-slate-900">
                  {newestSuggestion ? formatDateTime(newestSuggestion.created_at) : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                  Latest report
                </span>
                <span className="font-semibold text-slate-900">
                  {newestReport ? formatDateTime(newestReport.created_at) : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <Sparkles className="h-4 w-4 text-slate-400" />
                  Top request
                </span>
                <span className="max-w-[11rem] truncate font-semibold text-slate-900">
                  {topRequest ? topRequest.name : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
