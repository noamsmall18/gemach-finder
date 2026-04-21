'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, AlertCircle, ChevronRight, BadgeCheck } from 'lucide-react'
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
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
      onClick={() => onSelect(gemach)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(gemach) }}}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${gemach.name}`}
      className="relative bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 cursor-pointer group overflow-hidden focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
    >
      {/* Category accent bar with gradient */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55, transparent)` }} />

      <div className="p-4 sm:p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-3.5">
          <span
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-bold tracking-wide uppercase"
            style={{
              backgroundColor: `${accentColor}0D`,
              color: accentColor,
            }}
          >
            <span className="text-sm not-italic normal-case">{emoji}</span>
            <span className="text-[10px]">{gemach.category}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 shrink-0 font-medium">
            <MapPin className="w-3 h-3" />
            <span className="max-w-[80px] sm:max-w-none truncate">{gemach.location}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-[15px] sm:text-[17px] md:text-lg font-bold text-slate-800 group-hover:text-navy transition-colors duration-300 leading-snug">
          <span className="inline">{gemach.name}</span>
          {gemach.verified && (
            <BadgeCheck
              className="inline-block w-4 h-4 sm:w-[18px] sm:h-[18px] ml-1 -mt-0.5 text-sky-500 shrink-0 align-middle"
              strokeWidth={2.25}
              aria-label="Verified gemach"
            />
          )}
        </h3>

        {/* Description */}
        <p className="text-[12px] sm:text-[13px] md:text-sm text-slate-500 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
          {gemach.description}
        </p>

        {/* Footer bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-3.5 border-t border-slate-100/60">
          {hasContact ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {gemach.contact_phone && (
                <span className="icon-phone w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                </span>
              )}
              {gemach.contact_email && (
                <span className="icon-mail w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                </span>
              )}
              {gemach.contact_website && (
                <span className="icon-globe w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-colors duration-200 cursor-pointer">
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-amber-500">
              <AlertCircle className="w-3 h-3" />
              Limited Info
            </span>
          )}
          <div className="ml-auto flex items-center gap-0.5 text-[11px] text-slate-300 group-hover:text-navy/50 transition-colors duration-300 font-medium">
            <span className="hidden sm:inline">Details</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
