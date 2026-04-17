'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
}

export default function SearchBar({ value, onChange, suggestions = [] }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowSuggestions(focused && suggestions.length > 0 && value.length >= 2)
  }, [focused, suggestions, value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="max-w-2xl mx-auto" ref={containerRef}>
      <div className="relative">
        <div
          className={`relative rounded-xl transition-all duration-200 ${
            focused
              ? 'bg-white shadow-md ring-2 ring-navy/10'
              : 'bg-white shadow-sm border border-slate-200/60'
          }`}
        >
          <Search className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-4 sm:h-4.5 transition-colors duration-200 ${focused ? 'text-navy' : 'text-slate-300'}`} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search gemachs..."
            className="w-full pl-10 sm:pl-11 pr-10 py-3 sm:py-3.5 text-sm bg-transparent rounded-xl outline-none placeholder:text-slate-300"
          />
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => { onChange(''); inputRef.current?.focus() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden"
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onChange(suggestion)
                    setShowSuggestions(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3 text-slate-300 shrink-0" />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
