'use client'

import { MapPin } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'

interface LocationFilterProps {
  selected: string | null
  onSelect: (location: string | null) => void
}

export default function LocationFilter({ selected, onSelect }: LocationFilterProps) {
  return (
    <div className="relative inline-flex items-center">
      <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        className="appearance-none pl-9 pr-8 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-navy/30 transition-all duration-200 cursor-pointer outline-none focus:border-navy"
      >
        <option value="">All Locations</option>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
      <svg className="absolute right-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
