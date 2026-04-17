'use client'

import { CATEGORIES, CATEGORY_ACCENT_COLORS } from '@/lib/constants'

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
  counts?: Record<string, number>
}

export default function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <div>
      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mb-2.5 sm:mb-3 text-center">Browse by category</div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:justify-center md:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
            selected === null
              ? 'bg-navy text-white border-navy shadow-[0_4px_16px_rgba(30,42,94,0.25)]'
              : 'bg-white/80 text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-white hover:text-slate-700'
          }`}
        >
          All
          {counts && (
            <span className={`text-[10px] tabular-nums ${selected === null ? 'text-white/60' : 'text-slate-400'}`}>
              {Object.values(counts).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.name
          const accentColor = CATEGORY_ACCENT_COLORS[cat.name] || '#64748B'
          const count = counts?.[cat.name]
          return (
            <button
              key={cat.name}
              onClick={() => onSelect(isActive ? null : cat.name)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all duration-300 active:scale-95 ${
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
              <span className="hidden sm:inline">{cat.name}</span>
              {count !== undefined && count > 0 && (
                <span className={`text-[10px] tabular-nums ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
