'use client'

import { motion } from 'framer-motion'
import { ChevronUp, Trophy } from 'lucide-react'
import type { WishlistItem } from '@/lib/types'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface WishlistCardProps {
  item: WishlistItem
  rank: number
  index: number
  hasVoted: boolean
  onVote: (id: string) => void
  maxVotes: number
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

const MEDAL_COLORS = {
  1: { bg: 'bg-amber-50', border: 'border-amber-200/80', text: 'text-amber-600', bar: '#F59E0B', medal: '🥇' },
  2: { bg: 'bg-slate-50', border: 'border-slate-200/80', text: 'text-slate-500', bar: '#94A3B8', medal: '🥈' },
  3: { bg: 'bg-orange-50/60', border: 'border-orange-200/60', text: 'text-orange-700', bar: '#C2782D', medal: '🥉' },
} as Record<number, { bg: string; border: string; text: string; bar: string; medal: string }>

export default function WishlistCard({ item, rank, index, hasVoted, onVote, maxVotes }: WishlistCardProps) {
  const emoji = getCategoryEmoji(item.category)
  const accentColor = CATEGORY_ACCENT_COLORS[item.category] || '#94A3B8'
  const medal = MEDAL_COLORS[rank]
  const isTop3 = rank <= 3
  const barPercent = maxVotes > 0 ? Math.max((item.vote_count / maxVotes) * 100, 4) : 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      layout
      className={`flex items-stretch rounded-xl border overflow-hidden transition-all duration-200 ${
        isTop3 && medal
          ? `${medal.bg} ${medal.border} hover:shadow-md`
          : 'bg-white border-slate-200/60 hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      {/* Upvote column */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onVote(item.id)}
        className={`flex flex-col items-center justify-center w-14 shrink-0 transition-all duration-200 cursor-pointer border-r ${
          hasVoted
            ? 'bg-navy/[0.06] border-navy/10'
            : isTop3 && medal
              ? `${medal.bg} border-inherit hover:bg-white/50`
              : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
        }`}
      >
        <motion.div
          key={hasVoted ? 'v' : 'n'}
          initial={hasVoted ? { y: -4, scale: 1.2 } : false}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <ChevronUp className={`w-4.5 h-4.5 ${hasVoted ? 'text-navy' : 'text-slate-400'}`} strokeWidth={2.5} />
        </motion.div>
        <span className={`text-sm font-bold tabular-nums leading-none mt-0.5 ${
          hasVoted ? 'text-navy' : 'text-slate-600'
        }`}>
          {item.vote_count}
        </span>
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0 px-4 py-3.5">
        <div className="flex items-center gap-2">
          {/* Rank indicator */}
          {isTop3 && medal ? (
            <span className="text-base leading-none">{medal.medal}</span>
          ) : (
            <span className="text-xs font-bold text-slate-300 tabular-nums w-4 text-center shrink-0">
              {rank}
            </span>
          )}

          <h3 className="font-heading text-[15px] font-bold text-slate-800 leading-snug truncate">
            {item.name}
          </h3>

          <span
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shrink-0"
            style={{ backgroundColor: `${accentColor}0D`, color: accentColor }}
          >
            <span className="text-xs normal-case">{emoji}</span>
            {item.category}
          </span>
        </div>

        {item.description && (
          <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-1 ml-6 sm:ml-6">
            {item.description}
          </p>
        )}

        {/* Vote bar + meta */}
        <div className="flex items-center gap-3 mt-2 ml-6 sm:ml-6">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[180px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${barPercent}%` }}
              transition={{ delay: index * 0.04 + 0.3, duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: isTop3 && medal ? medal.bar : accentColor }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
            {item.requested_by && <span>{item.requested_by}</span>}
            {item.requested_by && <span className="text-slate-300">&middot;</span>}
            <span>{timeAgo(item.created_at)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
