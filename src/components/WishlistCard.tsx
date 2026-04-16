'use client'

import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import type { WishlistItem } from '@/lib/types'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface WishlistCardProps {
  item: WishlistItem
  rank: number
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

export default function WishlistCard({ item, rank, index, hasVoted, onVote }: WishlistCardProps) {
  const emoji = getCategoryEmoji(item.category)
  const accentColor = CATEGORY_ACCENT_COLORS[item.category] || '#94A3B8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex items-center gap-4 bg-white rounded-xl border border-slate-200/60 px-4 py-3.5 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
    >
      {/* Rank */}
      <span className={`text-lg font-bold tabular-nums shrink-0 w-6 text-center ${
        rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-slate-300'
      }`}>
        {rank}
      </span>

      {/* Upvote button */}
      <motion.button
        whileTap={!hasVoted ? { scale: 0.92 } : undefined}
        onClick={() => !hasVoted && onVote(item.id)}
        disabled={hasVoted}
        className={`flex flex-col items-center justify-center w-11 h-14 rounded-lg border shrink-0 transition-all duration-200 ${
          hasVoted
            ? 'bg-navy/5 border-navy/20 cursor-default'
            : 'bg-white border-slate-200 hover:border-navy/30 hover:bg-navy/[0.03] cursor-pointer'
        }`}
      >
        <motion.div
          key={hasVoted ? 'voted' : 'not'}
          initial={hasVoted ? { y: -3 } : false}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <ChevronUp className={`w-4 h-4 ${hasVoted ? 'text-navy' : 'text-slate-400'}`} />
        </motion.div>
        <span className={`text-xs font-bold tabular-nums leading-none ${
          hasVoted ? 'text-navy' : 'text-slate-500'
        }`}>
          {item.vote_count}
        </span>
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading text-[15px] font-bold text-slate-800 leading-snug">
            {item.name}
          </h3>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shrink-0"
            style={{ backgroundColor: `${accentColor}0D`, color: accentColor }}
          >
            <span className="text-xs normal-case">{emoji}</span>
            {item.category}
          </span>
        </div>
        {item.description && (
          <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
          {item.requested_by && <span>{item.requested_by}</span>}
          {item.requested_by && <span className="text-slate-300">&middot;</span>}
          <span>{timeAgo(item.created_at)}</span>
        </div>
      </div>
    </motion.div>
  )
}
