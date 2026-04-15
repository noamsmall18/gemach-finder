'use client'

import { CATEGORIES, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div>
      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mb-3 text-center">Browse by category</div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:justify-center md:gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
            selected === null
              ? 'bg-navy text-white border-navy shadow-[0_4px_16px_rgba(30,42,94,0.25)]'
              : 'bg-white/80 text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-white hover:text-slate-700'
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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
                isActive
                  ? 'text-white border-transparent'
                  : 'bg-white/80 text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-white hover:text-slate-700'
              }`}
              style={isActive ? {
                backgroundColor: accentColor,
                borderColor: accentColor,
                boxShadow: `0 4px 16px ${accentColor}30`,
              } : undefined}
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
