'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Globe, MapPin, Clock, User, FileText, ExternalLink, AlertCircle } from 'lucide-react'
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-[calc(100%-2rem)] md:max-h-[85vh] overflow-y-auto overscroll-contain"
          >
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
              {/* Colored header bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66)` }}
              />

              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 md:hidden">
                <div className="w-10 h-1 rounded-full bg-slate-200" />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 transition-colors z-10"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>

              {/* Content */}
              <div className="p-6 pt-4 md:pt-6">
                {/* Category + Location */}
                <div className="flex items-start justify-between gap-3 pr-8">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors?.bg} ${colors?.text}`}>
                    <span className="text-sm">{emoji}</span> {gemach.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {gemach.location}
                  </span>
                </div>

                {/* Name */}
                <h2 className="font-heading text-2xl font-bold text-slate-800 mt-4 leading-tight">
                  {gemach.name}
                </h2>

                {/* Description */}
                <p className="text-slate-600 mt-3 leading-relaxed text-[15px]">
                  {gemach.description}
                </p>

                {/* Contact Buttons */}
                {hasContact ? (
                  <div className="mt-6 space-y-2.5">
                    {gemach.contact_phone && (
                      <a
                        href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.98] transition-all font-medium"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-emerald-600/70 font-normal">Call or Text</div>
                          <div className="text-sm truncate">{gemach.contact_phone}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto shrink-0 opacity-40" />
                      </a>
                    )}

                    {gemach.contact_email && (
                      <a
                        href={`mailto:${gemach.contact_email}`}
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.98] transition-all font-medium"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-blue-600/70 font-normal">Email</div>
                          <div className="text-sm truncate">{gemach.contact_email}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto shrink-0 opacity-40" />
                      </a>
                    )}

                    {gemach.contact_website && (
                      <a
                        href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-navy/5 text-navy hover:bg-navy/10 active:scale-[0.98] transition-all font-medium"
                      >
                        <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-navy/50 font-normal">Website</div>
                          <div className="text-sm truncate">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto shrink-0 opacity-40" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-50/80 text-amber-700">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium">Limited contact info.</span>{' '}
                      {gemach.notes ? 'See notes below for details.' : 'Check community boards for current contact.'}
                    </div>
                  </div>
                )}

                {/* Details Section */}
                {(gemach.contact_name || gemach.address || gemach.hours || gemach.notes) && (
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                    {gemach.contact_name && (
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Contact</div>
                          <div className="text-sm text-slate-700 mt-0.5">{gemach.contact_name}</div>
                        </div>
                      </div>
                    )}

                    {gemach.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Address</div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gemach.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-navy hover:underline mt-0.5 block"
                          >
                            {gemach.address}
                          </a>
                        </div>
                      </div>
                    )}

                    {gemach.hours && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hours</div>
                          <div className="text-sm text-slate-700 mt-0.5">{gemach.hours}</div>
                        </div>
                      </div>
                    )}

                    {gemach.notes && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Notes</div>
                          <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">{gemach.notes}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom spacer for mobile safe area */}
                <div className="h-6 md:h-2" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
