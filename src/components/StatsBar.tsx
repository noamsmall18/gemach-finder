'use client'

import { motion } from 'framer-motion'
import { CATEGORY_ACCENT_COLORS } from '@/lib/constants'
import type { Gemach } from '@/lib/types'

interface StatsBarProps {
  gemachs: Gemach[]
  selectedCategory?: string | null
}

export default function StatsBar({ gemachs, selectedCategory }: StatsBarProps) {
  const categoryCounts = gemachs.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  const total = gemachs.length
  const hasSelection = !!selectedCategory

  return (
    <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden bg-slate-100/50">
      {sorted.map(([cat, count], i) => {
        const color = CATEGORY_ACCENT_COLORS[cat] || '#94A3B8'
        const width = (count / total) * 100
        const isActive = selectedCategory === cat
        return (
          <motion.div
            key={cat}
            initial={{ width: 0 }}
            animate={{
              width: `${width}%`,
              height: isActive ? 12 : hasSelection ? 4 : 8,
              opacity: hasSelection ? (isActive ? 1 : 0.25) : 1,
            }}
            transition={
              i === 0 && !hasSelection
                ? { delay: 0.5, duration: 0.6, ease: 'easeOut' }
                : { duration: 0.3, ease: 'easeOut' }
            }
            className="rounded-full"
            style={{ backgroundColor: color }}
            title={`${cat}: ${count}`}
          />
        )
      })}
    </div>
  )
}
