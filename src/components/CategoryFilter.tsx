'use client'

import { CATEGORIES } from '@/lib/constants'

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 active:scale-95 ${
          selected === null
            ? 'bg-navy text-white border-navy shadow-md'
            : 'bg-white text-slate-600 border-slate-200 hover:border-navy/30'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(selected === cat.name ? null : cat.name)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-200 active:scale-95 ${
            selected === cat.name
              ? 'bg-navy text-white border-navy shadow-md'
              : 'bg-white text-slate-600 border-slate-200 hover:border-navy/30'
          }`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}
