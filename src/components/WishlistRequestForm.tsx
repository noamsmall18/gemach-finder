'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { submitWishlistItem, getOrCreateFingerprint, addVotedId } from '@/lib/wishlist'
import type { WishlistItem } from '@/lib/types'

interface WishlistRequestFormProps {
  onItemAdded: (item: WishlistItem) => void
}

export default function WishlistRequestForm({ onItemAdded }: WishlistRequestFormProps) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    requested_by: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.category) {
      setError('Please provide a name and category.')
      return
    }

    setSubmitting(true)

    const item = await submitWishlistItem({
      name: form.name,
      category: form.category,
      description: form.description || undefined,
      requested_by: form.requested_by || undefined,
    })

    if (!item) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    // Auto-vote for own submission
    const fp = getOrCreateFingerprint()
    addVotedId(item.id)
    // Vote is implicit since vote_count starts at 1,
    // but record the fingerprint so they can't vote again
    const { supabase } = await import('@/lib/supabase')
    await supabase.from('wishlist_votes').insert({
      wishlist_item_id: item.id,
      voter_fingerprint: fp,
    })

    setSubmitting(false)
    setSuccess(true)
    onItemAdded(item)

    setTimeout(() => {
      setSuccess(false)
      setForm({ name: '', category: '', description: '', requested_by: '' })
    }, 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            What gemach do you wish existed? <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
            placeholder="e.g. Stroller Gemach, Book Gemach..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            Why is this needed? <span className="text-slate-300 font-medium normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
            placeholder="Brief reason..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            Your name <span className="text-slate-300 font-medium normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={form.requested_by}
            onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
            placeholder="So others can see who asked"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl font-medium">{error}</p>
      )}

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-sage/10 text-sage rounded-xl font-bold text-sm"
          >
            <Check className="w-4 h-4" />
            Added to the wishlist!
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-navy to-navy-deep text-white rounded-xl font-bold hover:shadow-[0_8px_24px_rgba(30,42,94,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none text-sm"
          >
            {submitting ? 'Submitting...' : (
              <>
                <Send className="w-4 h-4" />
                Submit Wish
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  )
}
