'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import WishlistCard from './WishlistCard'
import WishlistRequestForm from './WishlistRequestForm'
import { fetchWishlistItems, voteForItem, getOrCreateFingerprint, getVotedIds, addVotedId } from '@/lib/wishlist'
import type { WishlistItem } from '@/lib/types'

export default function WishlistSection() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [fingerprint, setFingerprint] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFingerprint(getOrCreateFingerprint())
    setVotedIds(getVotedIds())
    fetchWishlistItems().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  const handleVote = useCallback(async (id: string) => {
    // Optimistic update
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, vote_count: item.vote_count + 1 } : item
    ))
    setVotedIds(prev => new Set([...prev, id]))
    addVotedId(id)

    const success = await voteForItem(id, fingerprint)
    if (!success) {
      // Roll back
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, vote_count: item.vote_count - 1 } : item
      ))
      setVotedIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }, [fingerprint])

  const handleItemAdded = useCallback((item: WishlistItem) => {
    setItems(prev => [item, ...prev])
    setVotedIds(prev => new Set([...prev, item.id]))
  }, [])

  return (
    <section id="wishlist" className="py-16 md:py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/[0.015] to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-gold" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-800">
                Community Wishlist
              </h2>
            </div>
            <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
              What gemach does the community need? Request one below and vote for the ideas you support.
            </p>
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm mb-8">
            <WishlistRequestForm onItemAdded={handleItemAdded} />
          </div>

          {/* Wishlist Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-2xl bg-slate-100/50 animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">
                No wishes yet - be the first to request a gemach the community needs!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  index={i}
                  hasVoted={votedIds.has(item.id)}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
