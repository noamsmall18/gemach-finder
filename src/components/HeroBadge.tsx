'use client'

import AnimatedCounter from './AnimatedCounter'

interface HeroBadgeProps {
  count: number
}

export default function HeroBadge({ count }: HeroBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/[0.04] text-navy text-xs font-bold mb-6 border border-navy/[0.06]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
      </span>
      <AnimatedCounter target={count} /> gemachs across Bergen County
    </div>
  )
}
