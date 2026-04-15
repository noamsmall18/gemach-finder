'use client'

import AnimatedCounter from './AnimatedCounter'

interface HeroBadgeProps {
  count: number
}

export default function HeroBadge({ count }: HeroBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/5 text-navy text-xs font-medium mb-5 border border-navy/5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sage" />
      </span>
      <AnimatedCounter target={count} /> gemachs across Bergen County
    </div>
  )
}
