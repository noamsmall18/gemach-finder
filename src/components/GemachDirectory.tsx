'use client'

import { useState, useMemo } from 'react'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import LocationFilter from './LocationFilter'
import GemachCard from './GemachCard'
import GemachDetailModal from './GemachDetailModal'
import EmptyState from './EmptyState'
import StatsBar from './StatsBar'
import { searchGemachs, getSuggestions } from '@/lib/search'
import type { Gemach } from '@/lib/types'

interface GemachDirectoryProps {
  gemachs: Gemach[]
}

export default function GemachDirectory({ gemachs }: GemachDirectoryProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'location'>('name')
  const [selectedGemach, setSelectedGemach] = useState<Gemach | null>(null)

  const categoryCounts = useMemo(() => {
    return gemachs.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [gemachs])

  const suggestions = useMemo(() => {
    return getSuggestions(gemachs, search)
  }, [gemachs, search])

  const filtered = useMemo(() => {
    // Use fuzzy search instead of exact matching
    let results = search ? searchGemachs(gemachs, search) : gemachs

    if (category) {
      results = results.filter((g) => g.category === category)
    }

    if (location) {
      results = results.filter((g) => {
        if (g.location === location) return true
        if (g.location === 'Teaneck & Bergenfield' && (location === 'Teaneck' || location === 'Bergenfield')) return true
        if (g.location === 'Bergen County-wide') return true
        return false
      })
    }

    // Only sort alphabetically when not searching (search results are already ranked by relevance)
    if (!search) {
      results = [...results].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        return a.location.localeCompare(b.location) || a.name.localeCompare(b.name)
      })
    }

    return results
  }, [gemachs, search, category, location, sortBy])

  return (
    <div>
      <div className="mb-5 sm:mb-7">
        <SearchBar value={search} onChange={setSearch} suggestions={suggestions} />
      </div>

      <div className="mb-4 sm:mb-5">
        <CategoryFilter selected={category} onSelect={setCategory} counts={categoryCounts} />
      </div>

      <div className="mb-4 sm:mb-5">
        <StatsBar gemachs={gemachs} selectedCategory={category} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2">
          <LocationFilter selected={location} onSelect={setLocation} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'location')}
            className="appearance-none px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/80 border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700 transition-all duration-200 cursor-pointer outline-none focus:border-navy"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>
        <span className="text-xs sm:text-sm text-slate-400 font-medium tabular-nums">
          {filtered.length} gemach{filtered.length !== 1 ? 's' : ''}
          {(category || location || search) && (
            <button
              onClick={() => { setCategory(null); setLocation(null); setSearch('') }}
              className="ml-2 text-xs text-navy/50 hover:text-navy font-semibold transition-colors"
            >
              Clear filters
            </button>
          )}
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {filtered.map((gemach, i) => (
            <GemachCard
              key={gemach.id}
              gemach={gemach}
              index={i}
              onSelect={setSelectedGemach}
            />
          ))}
        </div>
      ) : (
        <EmptyState query={search} />
      )}

      <GemachDetailModal
        gemach={selectedGemach}
        onClose={() => setSelectedGemach(null)}
      />
    </div>
  )
}
