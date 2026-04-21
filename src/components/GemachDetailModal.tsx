'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Globe, MapPin, Clock, User, FileText, AlertCircle, ArrowUpRight, Share2, Check, BadgeCheck } from 'lucide-react'
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

  const handleWhatsApp = useCallback(() => {
    if (!gemach) return
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const lines = [
      `*${gemach.name}*`,
      `${getCategoryEmoji(gemach.category)} ${gemach.category} · 📍 ${gemach.location}`,
      '',
      gemach.description,
    ]
    if (gemach.contact_phone) lines.push('', `📞 ${gemach.contact_phone}`)
    if (gemach.contact_email) lines.push(`✉️ ${gemach.contact_email}`)
    if (gemach.contact_website) lines.push(`🌐 ${gemach.contact_website}`)
    if (gemach.address) lines.push(`🏠 ${gemach.address}`)
    if (gemach.hours) lines.push(`🕒 ${gemach.hours}`)
    if (siteUrl) lines.push('', `More gemachs: ${siteUrl}`)
    const url = `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
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
              className="min-h-full flex items-end sm:items-center justify-center sm:p-4"
              onClick={onClose}
            >
              {/* Card - full height on mobile, centered on desktop */}
              <div
                className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle for mobile */}
                <div className="flex justify-center pt-2.5 pb-0 sm:hidden">
                  <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-5 pb-2 sm:pb-3 md:pt-6 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      color: accentColor,
                    }}
                  >
                    <span className="text-sm">{emoji}</span> {gemach.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleWhatsApp}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 active:bg-emerald-100 transition-colors group"
                      title="Share on WhatsApp"
                      aria-label="Share on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400 group-hover:text-[#25D366] transition-colors" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
                      title="Share"
                    >
                      {copied ? <Check className="w-4 h-4 text-sea" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-5 pb-8">
                  <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    <span className="inline">{gemach.name}</span>
                    {gemach.verified && (
                      <BadgeCheck
                        className="inline-block w-5 h-5 sm:w-[22px] sm:h-[22px] ml-1.5 -mt-1 text-sky-500 shrink-0 align-middle"
                        strokeWidth={2.25}
                        aria-label="Verified gemach"
                      />
                    )}
                  </h2>
                  <div className="flex items-center gap-1 mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {gemach.location}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4 leading-relaxed">
                    {gemach.description}
                  </p>

                  {/* Contact */}
                  {hasContact ? (
                    <div className="mt-4 sm:mt-5 space-y-2">
                      {gemach.contact_phone && (
                        <a
                          href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                          className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.98] transition-all"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Call</div>
                            <div className="text-xs sm:text-sm truncate font-medium">{gemach.contact_phone}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                        </a>
                      )}

                      {gemach.contact_email && (
                        <a
                          href={`mailto:${gemach.contact_email}`}
                          className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-[0.98] transition-all"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">Email</div>
                            <div className="text-xs sm:text-sm truncate font-medium">{gemach.contact_email}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                        </a>
                      )}

                      {gemach.contact_website && (
                        <a
                          href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Website</div>
                            <div className="text-xs sm:text-sm truncate font-medium">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
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
