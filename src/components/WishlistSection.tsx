'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, TrendingUp } from 'lucide-react'
import WishlistCard from './WishlistCard'
import WishlistRequestForm from './WishlistRequestForm'
import { fetchWishlistItems, voteForItem, unvoteForItem, getOrCreateFingerprint, getVotedIds, addVotedId, removeVotedId } from '@/lib/wishlist'
import type { WishlistItem } from '@/lib/types'

type SortMode = 'votes' | 'newest'

export default function WishlistSection() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [fingerprint, setFingerprint] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>('votes')

  useEffect(() => {
    setFingerprint(getOrCreateFingerprint())
    setVotedIds(getVotedIds())
    fetchWishlistItems().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  const handleToggleVote = useCallback(async (id: string) => {
    const alreadyVoted = votedIds.has(id)

    if (alreadyVoted) {
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, vote_count: Math.max(item.vote_count - 1, 0) } : item
      ))
      setVotedIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      removeVotedId(id)

      const success = await unvoteForItem(id, fingerprint)
      if (!success) {
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, vote_count: item.vote_count + 1 } : item
        ))
        setVotedIds(prev => new Set([...prev, id]))
        addVotedId(id)
      }
    } else {
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, vote_count: item.vote_count + 1 } : item
      ))
      setVotedIds(prev => new Set([...prev, id]))
      addVotedId(id)

      const success = await voteForItem(id, fingerprint)
      if (!success) {
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, vote_count: item.vote_count - 1 } : item
        ))
        setVotedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        removeVotedId(id)
      }
    }
  }, [fingerprint, votedIds])

  const handleItemAdded = useCallback((item: WishlistItem) => {
    setItems(prev => [item, ...prev])
    setVotedIds(prev => new Set([...prev, item.id]))
  }, [])

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (sortMode === 'votes') return b.vote_count - a.vote_count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [items, sortMode])

  // Ranks always by votes
  const voteRanked = useMemo(() => {
    return [...items].sort((a, b) => b.vote_count - a.vote_count || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [items])
  const rankMap = useMemo(() => {
    const map = new Map<string, number>()
    voteRanked.forEach((item, i) => map.set(item.id, i + 1))
    return map
  }, [voteRanked])

  const maxVotes = useMemo(() => Math.max(...items.map(i => i.vote_count), 1), [items])
  const totalVotes = useMemo(() => items.reduce((sum, i) => sum + i.vote_count, 0), [items])

  return (
    <section id="requests" className="py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-800">
              Community Requests
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Vote for the gemachs your community needs most.
            </p>

            {/* Stats row */}
            {items.length > 0 && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-xs text-slate-300">&middot;</span>
                <span className="text-xs font-semibold text-slate-400 tabular-nums">
                  {items.length} request{items.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 mb-6">
            <WishlistRequestForm onItemAdded={handleItemAdded} />
          </div>

          {/* Leaderboard */}
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-slate-100/50 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">
                No requests yet. Be the first to suggest a gemach the community needs.
              </p>
            </div>
          ) : (
            <>
              {/* Sort controls */}
              {items.length > 1 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Leaderboard
                  </span>
                  <button
                    onClick={() => setSortMode(sortMode === 'votes' ? 'newest' : 'votes')}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    {sortMode === 'votes' ? 'Top Voted' : 'Newest First'}
                  </button>
                </div>
              )}

              {/* Cards */}
              <div className="space-y-2">
                {sorted.map((item, i) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    rank={rankMap.get(item.id) || i + 1}
                    index={i}
                    hasVoted={votedIds.has(item.id)}
                    onVote={handleToggleVote}
                    maxVotes={maxVotes}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
