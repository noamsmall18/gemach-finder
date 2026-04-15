'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji, getCategoryColors } from '@/lib/constants'

interface GemachCardProps {
  gemach: Gemach
  index: number
  onSelect: (gemach: Gemach) => void
}

export default function GemachCard({ gemach, index, onSelect }: GemachCardProps) {
  const colors = getCategoryColors(gemach.category)
  const emoji = getCategoryEmoji(gemach.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect(gemach)}
      className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(45,58,110,0.1)] transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Hover gradient border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-navy/10" />

      {/* Header: category badge + location */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
          <span>{emoji}</span> {gemach.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
          <MapPin className="w-3 h-3" />
          {gemach.location}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-slate-800 group-hover:text-navy transition-colors duration-200 leading-snug">
        {gemach.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
        {gemach.description}
      </p>

      {/* Contact indicators */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
        {gemach.contact_phone && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50/80 text-emerald-600">
            <Phone className="w-3 h-3" />
            Call
          </span>
        )}
        {gemach.contact_email && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50/80 text-blue-600">
            <Mail className="w-3 h-3" />
            Email
          </span>
        )}
        {gemach.contact_website && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-navy/5 text-navy/70">
            <Globe className="w-3 h-3" />
            Web
          </span>
        )}
        <span className="ml-auto text-xs text-slate-300 group-hover:text-navy/40 transition-colors">
          Tap for details
        </span>
      </div>
    </motion.div>
  )
}
