'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { WishlistItem } from '@/lib/types'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface WishlistCardProps {
  item: WishlistItem
  index: number
  hasVoted: boolean
  onVote: (id: string) => void
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function WishlistCard({ item, index, hasVoted, onVote }: WishlistCardProps) {
  const emoji = getCategoryEmoji(item.category)
  const accentColor = CATEGORY_ACCENT_COLORS[item.category] || '#94A3B8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 overflow-hidden"
    >
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55, transparent)` }}
      />

      <div className="p-5 flex gap-4">
        <div className="flex-1 min-w-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase"
            style={{
              backgroundColor: `${accentColor}0D`,
              color: accentColor,
            }}
          >
            <span className="text-sm not-italic normal-case">{emoji}</span>
            <span className="text-[10px]">{item.category}</span>
          </span>

          <h3 className="font-heading text-[16px] md:text-[17px] font-bold text-slate-800 mt-2.5 leading-snug">
            {item.name}
          </h3>

          {item.description && (
            <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed line-clamp-1">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400 font-medium">
            {item.requested_by && <span>by {item.requested_by}</span>}
            {item.requested_by && <span>&middot;</span>}
            <span>{timeAgo(item.created_at)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <motion.button
            whileTap={!hasVoted ? { scale: 0.9 } : undefined}
            onClick={() => !hasVoted && onVote(item.id)}
            disabled={hasVoted}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              hasVoted
                ? 'bg-gold/10 cursor-default'
                : 'bg-slate-50 hover:bg-gold/10 cursor-pointer'
            }`}
          >
            <motion.div
              key={hasVoted ? 'voted' : 'not-voted'}
              initial={hasVoted ? { scale: 1.3 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-300 ${
                  hasVoted ? 'text-gold fill-gold' : 'text-slate-300'
                }`}
              />
            </motion.div>
          </motion.button>
          <span
            className={`text-xs font-bold mt-1 tabular-nums ${
              hasVoted ? 'text-gold' : 'text-slate-400'
            }`}
          >
            {item.vote_count}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
