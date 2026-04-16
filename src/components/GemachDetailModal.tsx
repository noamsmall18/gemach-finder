'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Globe, MapPin, Clock, User, FileText, AlertCircle, ArrowUpRight, Share2, Check } from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { getCategoryEmoji, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface GemachDetailModalProps {
  gemach: Gemach | null
  onClose: () => void
}

export default function GemachDetailModal({ gemach, onClose }: GemachDetailModalProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    if (!gemach) return
    const text = `${gemach.name} - ${gemach.description}${gemach.contact_phone ? `\nPhone: ${gemach.contact_phone}` : ''}${gemach.contact_email ? `\nEmail: ${gemach.contact_email}` : ''}${gemach.contact_website ? `\nWeb: ${gemach.contact_website}` : ''}`
    if (navigator.share) {
      try { await navigator.share({ title: gemach.name, text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [gemach])

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

          {/* Scrollable overlay - the OVERLAY scrolls, not the card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div
              className="min-h-full flex items-end md:items-center justify-center md:p-4"
              onClick={onClose}
            >
              {/* Card - never scrolls internally */}
              <div
                className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3 md:pt-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      color: accentColor,
                    }}
                  >
                    <span className="text-sm">{emoji}</span> {gemach.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleShare}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                      title="Share"
                    >
                      {copied ? <Check className="w-4 h-4 text-sage" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Content - all visible, no scroll */}
                <div className="px-5 pb-8">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    {gemach.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1.5 text-sm text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {gemach.location}
                  </div>

                  <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                    {gemach.description}
                  </p>

                  {/* Contact */}
                  {hasContact ? (
                    <div className="mt-5 space-y-2">
                      {gemach.contact_phone && (
                        <a
                          href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.99] transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Call</div>
                            <div className="text-sm truncate font-medium">{gemach.contact_phone}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                        </a>
                      )}

                      {gemach.contact_email && (
                        <a
                          href={`mailto:${gemach.contact_email}`}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.99] transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">Email</div>
                            <div className="text-sm truncate font-medium">{gemach.contact_email}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                        </a>
                      )}

                      {gemach.contact_website && (
                        <a
                          href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-[0.99] transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Website</div>
                            <div className="text-sm truncate font-medium">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>
                        <span className="font-medium">Limited contact info.</span>{' '}
                        {gemach.notes ? 'See notes below.' : 'Check community boards for current contact.'}
                      </span>
                    </div>
                  )}

                  {/* Details */}
                  {(gemach.contact_name || gemach.address || gemach.hours || gemach.notes) && (
                    <div className="mt-6 pt-5 space-y-4">
                      {gemach.contact_name && (
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Contact</div>
                            <div className="text-sm text-slate-700 mt-0.5">{gemach.contact_name}</div>
                          </div>
                        </div>
                      )}

                      {gemach.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Address</div>
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
                          <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hours</div>
                            <div className="text-sm text-slate-700 mt-0.5">{gemach.hours}</div>
                          </div>
                        </div>
                      )}

                      {gemach.notes && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Additional Info</div>
                            <div className="text-sm text-slate-600 mt-0.5 leading-relaxed">{gemach.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
