'use client'

import { useState, useMemo } from 'react'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import LocationFilter from './LocationFilter'
import GemachCard from './GemachCard'
import GemachDetailModal from './GemachDetailModal'
import EmptyState from './EmptyState'
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

  const filtered = useMemo(() => {
    let results = gemachs

    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.notes && g.notes.toLowerCase().includes(q)) ||
          (g.contact_name && g.contact_name.toLowerCase().includes(q))
      )
    }

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

    results = [...results].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      return a.location.localeCompare(b.location) || a.name.localeCompare(b.name)
    })

    return results
  }, [gemachs, search, category, location, sortBy])

  return (
    <div>
      {/* Search */}
      <div className="mb-7">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Categories */}
      <div className="mb-5">
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <LocationFilter selected={location} onSelect={setLocation} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'location')}
            className="appearance-none px-3.5 py-2 rounded-xl text-sm font-semibold bg-white/80 border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700 transition-all duration-200 cursor-pointer outline-none focus:border-navy"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>
        <span className="text-sm text-slate-400 font-medium tabular-nums">
          {filtered.length} gemach{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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

      {/* Detail Modal */}
      <GemachDetailModal
        gemach={selectedGemach}
        onClose={() => setSelectedGemach(null)}
      />
    </div>
  )
}
