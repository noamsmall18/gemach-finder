import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reports - Admin',
  robots: { index: false, follow: false },
}

interface ReportRow {
  id: string
  gemach_id: string
  reason: string | null
  created_at: string
  resolved: boolean
}

interface GemachStub {
  id: string
  name: string
  slug: string | null
  report_count: number
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

async function resolveReport(id: string) {
  'use server'
  if (!(await isAdmin())) redirect('/admin')
  const sc = serviceClient()
  await sc.from('gemach_reports').update({ resolved: true }).eq('id', id)
  revalidatePath('/admin/reports')
}

async function deleteReport(id: string) {
  'use server'
  if (!(await isAdmin())) redirect('/admin')
  const sc = serviceClient()
  await sc.from('gemach_reports').delete().eq('id', id)
  revalidatePath('/admin/reports')
}

export default async function AdminReportsPage() {
  if (!(await isAdmin())) redirect('/admin')
  const sc = serviceClient()
  const { data: reports } = await sc
    .from('gemach_reports')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false })
  const list = (reports || []) as ReportRow[]

  const ids = Array.from(new Set(list.map((r) => r.gemach_id)))
  const { data: gemachs } =
    ids.length > 0
      ? await sc.from('gemachs').select('id, name, slug, report_count').in('id', ids)
      : { data: [] }
  const byId = new Map<string, GemachStub>()
  for (const g of (gemachs || []) as GemachStub[]) byId.set(g.id, g)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-navy">Reports</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/suggestions" className="text-slate-600 hover:text-navy">
            Suggestions
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/admin/gemachs" className="text-slate-600 hover:text-navy">
            Gemachs
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500">
          No unresolved reports.
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => {
            const g = byId.get(r.gemach_id)
            return (
              <li
                key={r.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">
                      {g?.name || 'Unknown gemach'}
                    </span>
                    {g?.slug && (
                      <Link
                        href={`/g/${g.slug}`}
                        target="_blank"
                        className="text-xs text-navy hover:underline"
                      >
                        View
                      </Link>
                    )}
                    {g?.report_count && g.report_count > 1 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {g.report_count} reports
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {r.reason?.trim() || <span className="text-slate-400 italic">No reason given</span>}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <form action={resolveReport.bind(null, r.id)}>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                      Mark resolved
                    </button>
                  </form>
                  <form action={deleteReport.bind(null, r.id)}>
                    <button className="text-xs px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
