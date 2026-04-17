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
      <MapPin className="absolute left-2.5 sm:left-3 w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 pointer-events-none" />
      <select
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        className="appearance-none pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/80 border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700 transition-all duration-200 cursor-pointer outline-none focus:border-navy"
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
