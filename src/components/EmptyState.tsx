'use client'

import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  query: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-20 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-5 shadow-inner">
        <Search className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-700">
        No gemachs found{query ? ` for "${query}"` : ''}
      </h3>
      <p className="text-slate-400 mt-2.5 max-w-md mx-auto text-sm leading-relaxed">
        Try a different search term, or browse by category.
        Know of a gemach we&apos;re missing?
      </p>
      <a
        href="#suggest"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-navy to-navy-deep text-white rounded-xl font-bold text-sm hover:shadow-[0_8px_24px_rgba(30,42,94,0.25)] transition-all duration-300 group"
      >
        Suggest a Gemach
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </motion.div>
  )
}
