'use client'

import { useEffect, useState } from 'react'
import { isOpenNow, parseHours } from '@/lib/hours'

interface OpenNowBadgeProps {
  hours: string | null | undefined
  size?: 'sm' | 'xs'
}

export default function OpenNowBadge({ hours, size = 'xs' }: OpenNowBadgeProps) {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    // Only compute on the client so SSR markup stays consistent with all locales/timezones
    if (!parseHours(hours)) {
      setOpen(null)
      return
    }
    const tick = () => setOpen(isOpenNow(hours))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [hours])

  if (open === null) return null

  const textClass = size === 'sm' ? 'text-[11px]' : 'text-[10px]'

  if (open) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold ${textClass}`}
        aria-label="Open now"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Open now
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold ${textClass}`}
      aria-label="Currently closed"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Closed
    </span>
  )
}
