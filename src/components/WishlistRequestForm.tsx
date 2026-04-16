'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown, Check } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { submitWishlistItem, getOrCreateFingerprint, addVotedId } from '@/lib/wishlist'
import type { WishlistItem } from '@/lib/types'

interface WishlistRequestFormProps {
  onItemAdded: (item: WishlistItem) => void
}

export default function WishlistRequestForm({ onItemAdded }: WishlistRequestFormProps) {
  const [expanded, setExpanded] = useState(false)
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

    const fp = getOrCreateFingerprint()
    addVotedId(item.id)
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
      setExpanded(false)
      setForm({ name: '', category: '', description: '', requested_by: '' })
    }, 2000)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-3 text-sage font-semibold text-sm"
      >
        <Check className="w-4 h-4" />
        Request added - your vote counts!
      </motion.div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-navy/60 hover:text-navy bg-navy/[0.03] hover:bg-navy/[0.06] rounded-xl transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Submit a Request
      </button>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-slate-700">New Request</span>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
          placeholder="What gemach should exist?"
          autoFocus
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full sm:w-44 px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
        >
          <option value="">Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
          placeholder="Why is this needed? (optional)"
        />
        <input
          type="text"
          value={form.requested_by}
          onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
          placeholder="Your name (optional)"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3.5 py-2 rounded-lg font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-deep active:scale-[0.98] transition-all duration-200 disabled:opacity-50 text-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </motion.form>
  )
}
