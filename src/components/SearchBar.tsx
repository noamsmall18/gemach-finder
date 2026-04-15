'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const QUICK_SEARCHES = ['wheelchair', 'gown', 'baby', 'loans', 'food', 'tables', 'costume']

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.03)] focus-within:shadow-[0_4px_24px_rgba(30,42,94,0.1),0_0_0_2px_rgba(30,42,94,0.08)] transition-all duration-400">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for wheelchair, baby clothes, gowns, loans..."
          className="w-full pl-12 pr-12 py-4 md:py-4.5 text-base md:text-lg bg-transparent rounded-2xl outline-none placeholder:text-slate-300"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>
      {/* Quick search chips */}
      {!value && (
        <div className="flex items-center justify-center gap-1.5 mt-3.5 flex-wrap">
          <span className="text-[11px] text-slate-300 mr-0.5 font-medium">Try:</span>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => onChange(term)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-400 bg-white/60 border border-slate-100 hover:text-navy hover:border-navy/20 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
