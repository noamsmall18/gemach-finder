'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Sparkles } from 'lucide-react'
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
    <section id="suggest" className="py-16 md:py-24 px-4 relative">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.015] to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-white/70 backdrop-blur-2xl rounded-[28px] p-7 md:p-10 border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.03),0_12px_48px_rgba(0,0,0,0.02)]"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-sage/10 to-sage/5 rounded-2xl flex items-center justify-center mx-auto"
                >
                  <Check className="w-10 h-10 text-sage" />
                </motion.div>
                <h3 className="font-heading text-2xl font-bold mt-6 text-slate-800">Thank you!</h3>
                <p className="text-slate-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
                  Your suggestion has been submitted. We&apos;ll verify the info and add it to the directory soon.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ gemach_name: '', category: '', description: '', contact_info: '', submitted_by: '' })
                  }}
                  className="mt-6 text-sm font-bold text-navy hover:text-navy-light transition-colors"
                >
                  Submit another
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-slate-800">
                    Know a gemach we&apos;re missing?
                  </h2>
                </div>
                <p className="text-slate-500 mt-1.5 ml-[42px] text-sm">
                  Help us grow this directory. Every suggestion is reviewed and verified.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Gemach Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.gemach_name}
                        onChange={(e) => setForm({ ...form, gemach_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
                        placeholder="e.g. Teaneck Toy Gemach"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
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

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all resize-none text-sm"
                      placeholder="What do they lend or offer?"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Contact Info <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.contact_info}
                        onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
                        placeholder="Phone, email, or website"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        Your Name <span className="text-slate-300 font-medium normal-case">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.submitted_by}
                        onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/80 outline-none focus:border-navy focus:ring-2 focus:ring-navy/5 transition-all text-sm"
                        placeholder="So we can follow up"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl font-medium">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-navy to-navy-deep text-white rounded-xl font-bold hover:shadow-[0_8px_24px_rgba(30,42,94,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none text-sm"
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
        </motion.div>
      </div>
    </section>
  )
}
