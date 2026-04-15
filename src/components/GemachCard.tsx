'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji, getCategoryColors } from '@/lib/constants'

interface GemachCardProps {
  gemach: Gemach
  index: number
}

export default function GemachCard({ gemach, index }: GemachCardProps) {
  const [expanded, setExpanded] = useState(false)
  const colors = getCategoryColors(gemach.category)
  const emoji = getCategoryEmoji(gemach.category)

  const hasExpandableContent = gemach.address || gemach.hours || gemach.notes || gemach.contact_name

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={() => hasExpandableContent && setExpanded(!expanded)}
    >
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
      <h3 className="font-heading text-lg font-semibold text-slate-800 group-hover:text-navy transition-colors leading-snug">
        {gemach.name}
      </h3>

      {/* Description */}
      <p className={`text-sm text-slate-500 mt-2 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
        {gemach.description}
      </p>

      {/* Contact buttons */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {gemach.contact_phone && (
          <a
            href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Phone className="w-3 h-3" />
            {gemach.contact_phone}
          </a>
        )}
        {gemach.contact_email && (
          <a
            href={`mailto:${gemach.contact_email}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Mail className="w-3 h-3" />
            Email
          </a>
        )}
        {gemach.contact_website && (
          <a
            href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-navy/5 text-navy hover:bg-navy/10 transition-colors"
          >
            <Globe className="w-3 h-3" />
            Website
          </a>
        )}
        {hasExpandableContent && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors ml-auto"
          >
            {expanded ? (
              <>Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>More <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && hasExpandableContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
              {gemach.contact_name && (
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Contact:</span> {gemach.contact_name}
                </div>
              )}
              {gemach.address && (
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Address:</span> {gemach.address}
                </div>
              )}
              {gemach.hours && (
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Hours:</span> {gemach.hours}
                </div>
              )}
              {gemach.notes && (
                <div className="text-slate-600">
                  <span className="font-medium text-slate-700">Notes:</span> {gemach.notes}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
