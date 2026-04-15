'use client'

import { CATEGORIES, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div>
      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2.5 text-center">Browse by category</div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:justify-center">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 active:scale-95 ${
            selected === null
              ? 'bg-navy text-white border-navy shadow-md shadow-navy/20'
              : 'bg-white/70 backdrop-blur-sm text-slate-600 border-slate-200/80 hover:border-navy/30 hover:bg-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.name
          const accentColor = CATEGORY_ACCENT_COLORS[cat.name] || '#64748B'
          return (
            <button
              key={cat.name}
              onClick={() => onSelect(isActive ? null : cat.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-white border-transparent shadow-md'
                  : 'bg-white/70 backdrop-blur-sm text-slate-600 border-slate-200/80 hover:border-navy/30 hover:bg-white'
              }`}
              style={isActive ? { backgroundColor: accentColor, borderColor: accentColor, boxShadow: `0 4px 12px ${accentColor}33` } : undefined}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
