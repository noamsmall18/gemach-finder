'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const QUICK_SEARCHES = ['wheelchair', 'gown', 'baby', 'loans', 'food', 'tables']

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/60 focus-within:border-navy/20 focus-within:shadow-[0_4px_24px_rgba(45,58,110,0.12)] transition-all duration-300">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for wheelchair, baby clothes, gowns, loans..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-transparent rounded-2xl outline-none placeholder:text-slate-300"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>
      {/* Quick search suggestions */}
      {!value && (
        <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
          <span className="text-[11px] text-slate-300 mr-1">Try:</span>
          {QUICK_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => onChange(term)}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-slate-400 bg-white/50 border border-slate-100/80 hover:text-navy hover:border-navy/20 hover:bg-white transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
