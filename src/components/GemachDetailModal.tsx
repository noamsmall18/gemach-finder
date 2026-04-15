'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Globe, MapPin, Clock, User, FileText, ExternalLink, AlertCircle, ArrowUpRight } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji, getCategoryColors, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface GemachDetailModalProps {
  gemach: Gemach | null
  onClose: () => void
}

export default function GemachDetailModal({ gemach, onClose }: GemachDetailModalProps) {
  useEffect(() => {
    if (gemach) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [gemach])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const colors = gemach ? getCategoryColors(gemach.category) : null
  const emoji = gemach ? getCategoryEmoji(gemach.category) : ''
  const accentColor = gemach ? (CATEGORY_ACCENT_COLORS[gemach.category] || '#64748B') : '#64748B'
  const hasContact = gemach && (gemach.contact_phone || gemach.contact_email || gemach.contact_website)

  return (
    <AnimatePresence>
      {gemach && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-navy-deep/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl md:w-[calc(100%-2rem)] md:max-h-[85vh] overflow-y-auto overscroll-contain modal-scroll"
          >
            <div className="bg-white rounded-t-[28px] md:rounded-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] md:shadow-[0_24px_80px_rgba(0,0,0,0.2)] overflow-hidden">
              {/* Colored header */}
              <div
                className="relative px-6 pt-5 pb-4 md:pt-7 md:pb-5"
                style={{ background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)` }}
              >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)` }} />

                {/* Drag handle (mobile) */}
                <div className="flex justify-center mb-4 md:hidden">
                  <div className="w-10 h-1 rounded-full bg-slate-300/60" />
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all z-10"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>

                {/* Category + Location */}
                <div className="flex items-start justify-between gap-3 pr-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    <span className="text-base">{emoji}</span> {gemach.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {gemach.location}
                  </span>
                </div>

                {/* Name */}
                <h2 className="font-heading text-2xl md:text-[28px] font-bold text-slate-800 mt-3 leading-tight">
                  {gemach.name}
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 md:pb-8">
                {/* Description */}
                <p className="text-slate-600 mt-5 leading-[1.7] text-[15px]">
                  {gemach.description}
                </p>

                {/* Contact Buttons */}
                {hasContact ? (
                  <div className="mt-6 space-y-2">
                    {gemach.contact_phone && (
                      <a
                        href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 hover:from-emerald-100 hover:to-emerald-50 active:scale-[0.98] transition-all font-medium group/btn"
                      >
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover/btn:bg-emerald-200 transition-colors">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] text-emerald-500 font-semibold uppercase tracking-wider">Call</div>
                          <div className="text-sm truncate font-semibold">{gemach.contact_phone}</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 opacity-30 group-hover/btn:opacity-60 transition-opacity" />
                      </a>
                    )}

                    {gemach.contact_email && (
                      <a
                        href={`mailto:${gemach.contact_email}`}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 hover:from-blue-100 hover:to-blue-50 active:scale-[0.98] transition-all font-medium group/btn"
                      >
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover/btn:bg-blue-200 transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] text-blue-500 font-semibold uppercase tracking-wider">Email</div>
                          <div className="text-sm truncate font-semibold">{gemach.contact_email}</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 opacity-30 group-hover/btn:opacity-60 transition-opacity" />
                      </a>
                    )}

                    {gemach.contact_website && (
                      <a
                        href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-50/50 text-navy hover:from-slate-100 hover:to-slate-50 active:scale-[0.98] transition-all font-medium group/btn"
                      >
                        <div className="w-11 h-11 rounded-xl bg-navy/8 flex items-center justify-center shrink-0 group-hover/btn:bg-navy/12 transition-colors">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] text-navy/50 font-semibold uppercase tracking-wider">Website</div>
                          <div className="text-sm truncate font-semibold">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 ml-auto shrink-0 opacity-30 group-hover/btn:opacity-60 transition-opacity" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/60 text-amber-700">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                    <div className="text-sm">
                      <span className="font-semibold">Limited contact info.</span>{' '}
                      {gemach.notes ? 'See notes below for details.' : 'Check community boards for current contact.'}
                    </div>
                  </div>
                )}

                {/* Details Section */}
                {(gemach.contact_name || gemach.address || gemach.hours || gemach.notes) && (
                  <div className="mt-6 pt-5 border-t border-slate-100/80 space-y-4">
                    {gemach.contact_name && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Contact Person</div>
                          <div className="text-sm text-slate-700 mt-0.5 font-medium">{gemach.contact_name}</div>
                        </div>
                      </div>
                    )}

                    {gemach.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Address</div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gemach.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-navy hover:text-navy-light hover:underline mt-0.5 block font-medium transition-colors"
                          >
                            {gemach.address}
                          </a>
                        </div>
                      </div>
                    )}

                    {gemach.hours && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Hours</div>
                          <div className="text-sm text-slate-700 mt-0.5 font-medium">{gemach.hours}</div>
                        </div>
                      </div>
                    )}

                    {gemach.notes && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">Additional Info</div>
                          <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">{gemach.notes}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom safe area */}
                <div className="h-6 md:h-2" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
