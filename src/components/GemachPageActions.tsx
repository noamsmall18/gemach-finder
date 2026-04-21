'use client'

import { useState, useTransition } from 'react'
import { Share2, Check, Flag, ThumbsUp } from 'lucide-react'
import { markUsed, reportOutdated } from '@/app/g/[slug]/actions'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji } from '@/lib/constants'

interface Props {
  gemach: Gemach
}

export default function GemachPageActions({ gemach }: Props) {
  const [copied, setCopied] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSent, setReportSent] = useState(false)
  const [used, setUsed] = useState(false)
  const [usedCount, setUsedCount] = useState(gemach.used_count ?? 0)
  const [isPending, startTransition] = useTransition()

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `${gemach.name} on GemachFinder`
    if (navigator.share) {
      try {
        await navigator.share({ title: gemach.name, text, url })
        return
      } catch {}
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleWhatsApp() {
    const lines = [
      `*${gemach.name}*`,
      `${getCategoryEmoji(gemach.category)} ${gemach.category} - ${gemach.location}`,
      '',
      gemach.description,
    ]
    if (gemach.contact_phone) lines.push('', `Phone: ${gemach.contact_phone}`)
    if (gemach.contact_email) lines.push(`Email: ${gemach.contact_email}`)
    if (gemach.contact_website) lines.push(`Web: ${gemach.contact_website}`)
    if (gemach.address) lines.push(`Address: ${gemach.address}`)
    if (gemach.hours) lines.push(`Hours: ${gemach.hours}`)
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (url) lines.push('', url)
    const waUrl = `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  function handleUsed() {
    if (used) return
    setUsed(true)
    setUsedCount((c) => c + 1)
    startTransition(async () => {
      await markUsed(gemach.id, gemach.slug || '')
    })
  }

  function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await reportOutdated(gemach.id, gemach.slug || '', reportReason)
      setReportSent(true)
      setTimeout(() => {
        setReportOpen(false)
        setReportSent(false)
        setReportReason('')
      }, 1800)
    })
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleUsed}
          disabled={used || isPending}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
            used
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {used ? 'Thanks!' : 'I used this gemach'}
          {usedCount > 0 && (
            <span className="text-xs text-slate-500 font-normal">· {usedCount}</span>
          )}
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-sea" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share'}
        </button>

        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </button>

        <button
          onClick={() => setReportOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 transition-all"
        >
          <Flag className="w-4 h-4" />
          Report outdated
        </button>
      </div>

      {reportOpen && (
        <form
          onSubmit={handleReportSubmit}
          className="mt-3 p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3"
        >
          {reportSent ? (
            <div className="text-sm text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Thanks, we'll check on this.
            </div>
          ) : (
            <>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-700">
                What's out of date?
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Phone number changed, moved, closed, etc."
                className="w-full text-sm px-3 py-2 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 transition-colors"
                >
                  {isPending ? 'Sending...' : 'Submit report'}
                </button>
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  )
}
