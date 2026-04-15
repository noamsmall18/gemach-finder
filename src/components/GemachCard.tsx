'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, AlertCircle } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji, getCategoryColors, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface GemachCardProps {
  gemach: Gemach
  index: number
  onSelect: (gemach: Gemach) => void
}

export default function GemachCard({ gemach, index, onSelect }: GemachCardProps) {
  const colors = getCategoryColors(gemach.category)
  const emoji = getCategoryEmoji(gemach.category)
  const accentColor = CATEGORY_ACCENT_COLORS[gemach.category] || '#94A3B8'
  const hasContact = gemach.contact_phone || gemach.contact_email || gemach.contact_website

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      onClick={() => onSelect(gemach)}
      className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(45,58,110,0.12)] transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Category accent bar */}
      <div
        className="h-1 w-full rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
      />

      <div className="p-5 pt-4">
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
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100/60">
          {hasContact ? (
            <>
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
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
              <AlertCircle className="w-3 h-3" />
              Limited Info
            </span>
          )}
          <span className="ml-auto text-[11px] text-slate-300 group-hover:text-navy/40 transition-colors">
            Tap for details
          </span>
        </div>
      </div>
    </motion.div>
  )
}
