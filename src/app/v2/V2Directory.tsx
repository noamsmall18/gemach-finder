'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Phone, Mail, Globe, MapPin, Search, X, ArrowDown, ArrowUp, ArrowRight,
  AlertCircle, ChevronRight, Share2, Check, User, Clock, FileText, ArrowUpRight, BadgeCheck
} from 'lucide-react'
import type { Gemach } from '@/lib/types'
import { CATEGORIES, LOCATIONS, CATEGORY_ACCENT_COLORS, getCategoryEmoji, getCategoryColors } from '@/lib/constants'
import { searchGemachs, getSuggestions } from '@/lib/search'

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(target)
  const [hasAnimated, setHasAnimated] = useState(false)
  useEffect(() => {
    if (target === 0 || hasAnimated) return
    setHasAnimated(true)
    setCount(0)
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, hasAnimated])
  return <>{count}</>
}

/* ─── Stats Bar ─── */
function DarkStatsBar({ gemachs, selectedCategory }: { gemachs: Gemach[]; selectedCategory: string | null }) {
  const categoryCounts = gemachs.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  const total = gemachs.length
  const hasSelection = !!selectedCategory

  return (
    <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden bg-white/[0.04]">
      {sorted.map(([cat, count], i) => {
        const color = CATEGORY_ACCENT_COLORS[cat] || '#94A3B8'
        const width = (count / total) * 100
        const isActive = selectedCategory === cat
        return (
          <motion.div key={cat}
            initial={{ width: 0 }}
            animate={{
              width: `${width}%`,
              height: isActive ? 12 : hasSelection ? 4 : 8,
              opacity: hasSelection ? (isActive ? 1 : 0.25) : 1,
            }}
            transition={
              i === 0 && !hasSelection
                ? { delay: 0.5, duration: 0.6, ease: 'easeOut' }
                : { duration: 0.3, ease: 'easeOut' }
            }
            className="rounded-full" style={{ backgroundColor: color }}
            title={`${cat}: ${count}`} />
        )
      })}
    </div>
  )
}

/* ─── Main Component ─── */
export default function V2Directory({ gemachs }: { gemachs: Gemach[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'category' | 'location'>('popular')
  const [selectedGemach, setSelectedGemach] = useState<Gemach | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Click outside suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categoryCounts = useMemo(() => {
    return gemachs.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [gemachs])

  const suggestions = useMemo(() => getSuggestions(gemachs, search), [gemachs, search])

  useEffect(() => {
    setShowSuggestions(searchFocused && suggestions.length > 0 && search.length >= 2)
  }, [searchFocused, suggestions, search])

  const filtered = useMemo(() => {
    let results = search ? searchGemachs(gemachs, search) : gemachs
    if (category) results = results.filter(g => g.category === category)
    if (location) {
      results = results.filter(g => {
        if (g.location === location) return true
        if (g.location === 'Teaneck & Bergenfield' && (location === 'Teaneck' || location === 'Bergenfield')) return true
        if (g.location === 'Bergen County-wide') return true
        return false
      })
    }
    if (!search) {
      results = [...results].sort((a, b) => {
        if (sortBy === 'popular') return (b.priority - a.priority) || a.name.localeCompare(b.name)
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        return a.location.localeCompare(b.location) || a.name.localeCompare(b.name)
      })
    }
    return results
  }, [gemachs, search, category, location, sortBy])

  // Share handler
  const handleShare = useCallback(async () => {
    if (!selectedGemach) return
    const text = `${selectedGemach.name} - ${selectedGemach.description}${selectedGemach.contact_phone ? `\nPhone: ${selectedGemach.contact_phone}` : ''}${selectedGemach.contact_email ? `\nEmail: ${selectedGemach.contact_email}` : ''}${selectedGemach.contact_website ? `\nWeb: ${selectedGemach.contact_website}` : ''}`
    if (navigator.share) {
      try { await navigator.share({ title: selectedGemach.name, text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [selectedGemach])

  const handleWhatsApp = useCallback(() => {
    if (!selectedGemach) return
    const g = selectedGemach
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const lines = [
      `*${g.name}*`,
      `${getCategoryEmoji(g.category)} ${g.category} · 📍 ${g.location}`,
      '',
      g.description,
    ]
    if (g.contact_phone) lines.push('', `📞 ${g.contact_phone}`)
    if (g.contact_email) lines.push(`✉️ ${g.contact_email}`)
    if (g.contact_website) lines.push(`🌐 ${g.contact_website}`)
    if (g.address) lines.push(`🏠 ${g.address}`)
    if (g.hours) lines.push(`🕒 ${g.hours}`)
    if (siteUrl) lines.push('', `More gemachs: ${siteUrl}`)
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
  }, [selectedGemach])

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedGemach) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [selectedGemach])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedGemach(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F1A] text-white">
      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="relative min-h-[60vh] md:min-h-[55vh] flex items-center justify-center px-4 text-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-[#0B0F1A] to-[#0F1420]" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sea/[0.08] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-navy-light/[0.08] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-white/60">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <AnimatedCounter target={gemachs.length} /> verified gemachs
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              Find What You Need.
              <br />
              <span className="bg-gradient-to-r from-sea to-sea-light bg-clip-text text-transparent">Borrow It Free.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-5 text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
              The community directory of free lending services across Bergen County,
              Passaic County, and Rockland County. Baby gear, medical equipment, simcha supplies, and more.
            </motion.p>

            {/* Scroll indicator */}
            <motion.a href="#directory" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }} className="mt-10 flex justify-center">
              <motion.div animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center text-white/20 hover:text-white/40 hover:border-white/20 transition-colors">
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </motion.a>
          </div>
        </section>

        {/* ─── DIRECTORY ─── */}
        <section id="directory" className="px-4 sm:px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Search */}
            <div className="mb-7">
              <div className="max-w-2xl mx-auto" ref={searchContainerRef}>
                <div className="relative">
                  <div className={`relative rounded-xl transition-all duration-200 ${
                    searchFocused
                      ? 'bg-white/[0.08] shadow-md ring-2 ring-sea/30'
                      : 'bg-white/[0.05] border border-white/[0.06]'
                  }`}>
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200 ${searchFocused ? 'text-sea' : 'text-white/20'}`} />
                    <input ref={searchInputRef} type="text" value={search}
                      onChange={e => setSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      placeholder="Search by name, category, or keyword..."
                      className="w-full pl-11 pr-10 py-3.5 text-sm bg-transparent rounded-xl outline-none placeholder:text-white/20 text-white" />
                    <AnimatePresence>
                      {search && (
                        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => { setSearch(''); searchInputRef.current?.focus() }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors">
                          <X className="w-3 h-3 text-white/50" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Suggestions dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-[#1A1F2E] rounded-xl border border-white/[0.08] shadow-lg z-20 overflow-hidden">
                        {suggestions.map(suggestion => (
                          <button key={suggestion}
                            onMouseDown={e => { e.preventDefault(); setSearch(suggestion); setShowSuggestions(false) }}
                            className="w-full px-4 py-2.5 text-left text-sm text-white/60 hover:bg-white/[0.05] hover:text-sea-light transition-colors flex items-center gap-2">
                            <Search className="w-3 h-3 text-white/20 shrink-0" />
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-3 text-center">Browse by category</div>
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:justify-center md:gap-2">
                <button onClick={() => setCategory(null)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
                    category === null
                      ? 'bg-white text-[#0B0F1A] border-white shadow-[0_4px_16px_rgba(255,255,255,0.1)]'
                      : 'bg-white/[0.05] text-white/50 border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.08] hover:text-white/70'
                  }`}>
                  All
                  <span className={`text-[10px] tabular-nums ${category === null ? 'text-[#0B0F1A]/50' : 'text-white/30'}`}>
                    {Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
                  </span>
                </button>
                {CATEGORIES.map(cat => {
                  const isActive = category === cat.name
                  const accentColor = CATEGORY_ACCENT_COLORS[cat.name] || '#64748B'
                  const count = categoryCounts[cat.name]
                  return (
                    <button key={cat.name}
                      onClick={() => setCategory(isActive ? null : cat.name)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
                        isActive
                          ? 'text-white border-transparent'
                          : 'bg-white/[0.05] text-white/50 border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.08] hover:text-white/70'
                      }`}
                      style={isActive ? { backgroundColor: accentColor, borderColor: accentColor, boxShadow: `0 4px 16px ${accentColor}30` } : undefined}>
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                      {count !== undefined && count > 0 && (
                        <span className={`text-[10px] tabular-nums ${isActive ? 'text-white/60' : 'text-white/30'}`}>{count}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mb-5">
              <DarkStatsBar gemachs={gemachs} selectedCategory={category} />
            </div>

            {/* Filters row */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                {/* Location Filter */}
                <div className="relative inline-flex items-center">
                  <MapPin className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                  <select value={location || ''} onChange={e => setLocation(e.target.value || null)}
                    className="appearance-none pl-9 pr-8 py-2 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/[0.06] text-white/50 hover:border-white/[0.12] hover:text-white/70 transition-all duration-200 cursor-pointer outline-none focus:border-sea/60">
                    <option value="">All Locations</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <svg className="absolute right-3 w-3.5 h-3.5 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as 'popular' | 'name' | 'category' | 'location')}
                  className="appearance-none px-3.5 py-2 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/[0.06] text-white/50 hover:border-white/[0.12] hover:text-white/70 transition-all duration-200 cursor-pointer outline-none focus:border-sea/60">
                  <option value="popular">Popular</option>
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="location">Sort by Location</option>
                </select>
              </div>

              <span className="text-sm text-white/30 font-medium tabular-nums">
                {filtered.length} gemach{filtered.length !== 1 ? 's' : ''}
                {(category || location || search) && (
                  <button onClick={() => { setCategory(null); setLocation(null); setSearch('') }}
                    className="ml-2 text-xs text-sea/60 hover:text-sea font-semibold transition-colors">
                    Clear filters
                  </button>
                )}
              </span>
            </div>

            {/* Cards Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map((gemach, i) => {
                  const accentColor = CATEGORY_ACCENT_COLORS[gemach.category] || '#94A3B8'
                  const emoji = getCategoryEmoji(gemach.category)
                  const hasContact = gemach.contact_phone || gemach.contact_email || gemach.contact_website
                  return (
                    <motion.div key={gemach.id}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                      whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
                      onClick={() => setSelectedGemach(gemach)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedGemach(gemach) } }}
                      tabIndex={0} role="button" aria-label={`View details for ${gemach.name}`}
                      className="relative bg-white/[0.04] rounded-2xl border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 cursor-pointer group overflow-hidden focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F1A]">
                      {/* Accent bar */}
                      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}55, transparent)` }} />
                      <div className="p-5 md:p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase"
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                            <span className="text-sm not-italic normal-case">{emoji}</span>
                            <span className="text-[10px]">{gemach.category}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-white/25 shrink-0 font-medium">
                            <MapPin className="w-3 h-3" />{gemach.location}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="font-heading text-[17px] md:text-lg font-bold text-white/90 group-hover:text-sea-light transition-colors duration-300 leading-snug">
                          <span className="inline">{gemach.name}</span>
                          {gemach.verified && (
                            <BadgeCheck
                              className="inline-block w-[18px] h-[18px] ml-1 -mt-0.5 text-sky-400 shrink-0 align-middle"
                              strokeWidth={2.25}
                              aria-label="Verified gemach"
                            />
                          )}
                        </h3>
                        {/* Description */}
                        <p className="text-[13px] md:text-sm text-white/30 mt-2 leading-relaxed line-clamp-2">{gemach.description}</p>
                        {/* Footer */}
                        <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/[0.05]">
                          {hasContact ? (
                            <div className="flex items-center gap-2">
                              {gemach.contact_phone && (
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                </span>
                              )}
                              {gemach.contact_email && (
                                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                                </span>
                              )}
                              {gemach.contact_website && (
                                <span className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                                  <Globe className="w-3.5 h-3.5 text-white/30" />
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                              <AlertCircle className="w-3 h-3" />Limited Info
                            </span>
                          )}
                          <div className="ml-auto flex items-center gap-0.5 text-[11px] text-white/15 group-hover:text-sea/70 transition-colors duration-300 font-medium">
                            <span className="hidden sm:inline">Details</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              /* Empty State */
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="text-center py-20 px-4">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-white/15" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white/70">
                  No gemachs found{search ? ` for "${search}"` : ''}
                </h3>
                <p className="text-white/30 mt-2.5 max-w-md mx-auto text-sm leading-relaxed">
                  Try a different search term, or browse by category. Know of a gemach we&apos;re missing?
                </p>
                <a href="/suggest"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-sea to-navy-light text-white rounded-xl font-bold text-sm hover:shadow-[0_8px_24px_rgba(94,148,184,0.3)] transition-all duration-300 group">
                  Suggest a Gemach
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#070A12] text-white/50 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-14">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="max-w-xs">
              <Link href="/v2" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#C9971A"/>
                    <circle cx="12" cy="10" r="3.5" fill="white"/>
                  </svg>
                </div>
                <span className="font-heading text-base font-bold text-white/80">GemachFinder</span>
              </Link>
              <p className="text-sm text-white/25 mt-3 leading-relaxed">
                A community resource for Bergen, Passaic & Rockland Counties. {gemachs.length} verified gemachs and growing.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Navigate</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/v2" className="text-sm hover:text-white/80 transition-colors">Directory</Link>
                  <Link href="/requests" className="text-sm hover:text-white/80 transition-colors">Create</Link>
                  <Link href="/suggest" className="text-sm hover:text-white/80 transition-colors">Missing One?</Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Info</h4>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">{gemachs.length} gemachs</span>
                  <span className="text-sm">7 categories</span>
                  <span className="text-sm">100% free</span>
                </div>
              </div>
            </div>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-white/25 hover:text-white/50 transition-colors flex items-center gap-1.5">
              <ArrowUp className="w-3.5 h-3.5" />Top
            </button>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.04]">
            <p className="text-xs text-white/15">
              Data is community-sourced and verified. Contact info may change - please verify before visiting. Built by Noam Small.
            </p>
          </div>
        </div>
      </footer>


      {/* ─── DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedGemach && (() => {
          const gemach = selectedGemach
          const emoji = getCategoryEmoji(gemach.category)
          const accentColor = CATEGORY_ACCENT_COLORS[gemach.category] || '#64748B'
          const hasContact = gemach.contact_phone || gemach.contact_email || gemach.contact_website
          return (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedGemach(null)} />
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-0 z-50 overflow-y-auto">
                <div className="min-h-full flex items-end md:items-center justify-center md:p-4"
                  onClick={() => setSelectedGemach(null)}>
                  <div className="bg-[#141825] border border-white/[0.08] rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg"
                    onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-3 md:pt-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        <span className="text-sm">{emoji}</span> {gemach.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={handleWhatsApp}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-500/10 transition-colors group" title="Share on WhatsApp" aria-label="Share on WhatsApp">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/30 group-hover:text-[#25D366] transition-colors" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </button>
                        <button onClick={handleShare}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors" title="Share">
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-white/30" />}
                        </button>
                        <button onClick={() => setSelectedGemach(null)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors">
                          <X className="w-4 h-4 text-white/30" />
                        </button>
                      </div>
                    </div>

                    <div className="px-5 pb-8">
                      <h2 className="font-heading text-xl md:text-2xl font-bold text-white leading-tight">
                        <span className="inline">{gemach.name}</span>
                        {gemach.verified && (
                          <BadgeCheck
                            className="inline-block w-[22px] h-[22px] ml-1.5 -mt-1 text-sky-400 shrink-0 align-middle"
                            strokeWidth={2.25}
                            aria-label="Verified gemach"
                          />
                        )}
                      </h2>
                      <div className="flex items-center gap-1 mt-1.5 text-sm text-white/30">
                        <MapPin className="w-3.5 h-3.5" />{gemach.location}
                      </div>
                      <p className="text-sm text-white/50 mt-4 leading-relaxed">{gemach.description}</p>

                      {/* Contact */}
                      {hasContact ? (
                        <div className="mt-5 space-y-2">
                          {gemach.contact_phone && (
                            <a href={`tel:${gemach.contact_phone.replace(/[^+\d]/g, '')}`}
                              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 active:scale-[0.99] transition-all">
                              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-emerald-500/60 font-semibold uppercase tracking-wider">Call</div>
                                <div className="text-sm truncate font-medium">{gemach.contact_phone}</div>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                            </a>
                          )}
                          {gemach.contact_email && (
                            <a href={`mailto:${gemach.contact_email}`}
                              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/15 active:scale-[0.99] transition-all">
                              <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-blue-500/60 font-semibold uppercase tracking-wider">Email</div>
                                <div className="text-sm truncate font-medium">{gemach.contact_email}</div>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                            </a>
                          )}
                          {gemach.contact_website && (
                            <a href={gemach.contact_website.startsWith('http') ? gemach.contact_website : `https://${gemach.contact_website}`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white/50 hover:bg-white/[0.07] active:scale-[0.99] transition-all">
                              <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Website</div>
                                <div className="text-sm truncate font-medium">{gemach.contact_website.replace(/^https?:\/\//, '')}</div>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 ml-auto shrink-0 opacity-30" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0 opacity-60" />
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
                              <User className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Contact</div>
                                <div className="text-sm text-white/60 mt-0.5">{gemach.contact_name}</div>
                              </div>
                            </div>
                          )}
                          {gemach.address && (
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Address</div>
                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gemach.address)}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-sm text-sea hover:underline mt-0.5 block">{gemach.address}</a>
                              </div>
                            </div>
                          )}
                          {gemach.hours && (
                            <div className="flex items-start gap-3">
                              <Clock className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Hours</div>
                                <div className="text-sm text-white/60 mt-0.5">{gemach.hours}</div>
                              </div>
                            </div>
                          )}
                          {gemach.notes && (
                            <div className="flex items-start gap-3">
                              <FileText className="w-4 h-4 text-white/15 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Additional Info</div>
                                <div className="text-sm text-white/40 mt-0.5 leading-relaxed">{gemach.notes}</div>
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
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
