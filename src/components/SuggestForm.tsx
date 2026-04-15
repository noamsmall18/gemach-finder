'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/constants'

export default function SuggestForm() {
  const [form, setForm] = useState({
    gemach_name: '',
    category: '',
    description: '',
    contact_info: '',
    submitted_by: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.gemach_name || !form.category || !form.description || !form.contact_info) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    const { error: insertError } = await supabase
      .from('suggestions')
      .insert({
        gemach_name: form.gemach_name,
        category: form.category,
        description: form.description,
        contact_info: form.contact_info,
        submitted_by: form.submitted_by || null,
      })

    setSubmitting(false)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      return
    }

    setSubmitted(true)
  }

  return (
    <section id="suggest" className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gold-soft/40 rounded-3xl p-8 md:p-10">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Check className="w-8 h-8 text-sage" />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold mt-4 text-slate-800">Thank you!</h3>
                <p className="text-slate-500 mt-2">
                  Your suggestion has been submitted. We&apos;ll review it and add it to the directory soon.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ gemach_name: '', category: '', description: '', contact_info: '', submitted_by: '' })
                  }}
                  className="mt-4 text-sm text-navy hover:underline"
                >
                  Submit another
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-heading text-2xl font-semibold text-slate-800">
                  Know a gemach we&apos;re missing?
                </h2>
                <p className="text-slate-500 mt-2">
                  Help us grow this directory. Submit a gemach and we&apos;ll review it.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Gemach Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.gemach_name}
                      onChange={(e) => setForm({ ...form, gemach_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy transition-colors"
                      placeholder="e.g. Teaneck Toy Gemach"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy transition-colors"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy transition-colors resize-none"
                      placeholder="What do they lend or offer?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Info <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.contact_info}
                      onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy transition-colors"
                      placeholder="Phone number, email, or website"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your Name <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.submitted_by}
                      onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-navy transition-colors"
                      placeholder="So we can follow up if needed"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-deep transition-colors disabled:opacity-60"
                  >
                    {submitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Suggestion
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
