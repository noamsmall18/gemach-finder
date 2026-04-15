'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

const QUICK_SEARCHES = ['wheelchair', 'gown', 'baby', 'loans', 'food', 'tables', 'costume', 'medical']

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative rounded-2xl transition-all duration-400 ${
          focused
            ? 'bg-white shadow-[0_4px_32px_rgba(30,42,94,0.12),0_0_0_2px_rgba(30,42,94,0.08)]'
            : 'bg-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.03)]'
        }`}
      >
        <motion.div
          animate={{ scale: focused ? 1.1 : 1, color: focused ? '#1E2A5E' : '#CBD5E1' }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <Search className="w-5 h-5" />
        </motion.div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search gemachs..."
          className="w-full pl-12 pr-12 py-4 md:py-[18px] text-base md:text-lg bg-transparent rounded-2xl outline-none placeholder:text-slate-300"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Quick search chips */}
      <AnimatePresence>
        {!value && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-1.5 mt-3.5 flex-wrap"
          >
            <span className="text-[11px] text-slate-300 mr-0.5 font-medium">Try:</span>
            {QUICK_SEARCHES.map((term, i) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onChange(term)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-400 bg-white/60 border border-slate-100 hover:text-navy hover:border-navy/20 hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                {term}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
