'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function SunIcon() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-300"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <motion.line
            key={angle}
            x1={12 + 7.5 * Math.cos(rad)}
            y1={12 + 7.5 * Math.sin(rad)}
            x2={12 + 10.5 * Math.cos(rad)}
            y2={12 + 10.5 * Math.sin(rad)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.035, duration: 0.2 }}
          />
        )
      })}
    </motion.svg>
  )
}

function MoonIcon() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-500"
    >
      <motion.path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
        fillOpacity={0.15}
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={{ pathLength: 1, fillOpacity: 0.15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

export default function ThemeToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const isDark = pathname.startsWith('/v2')
  const [mounted, setMounted] = useState(false)
  const [clickEffect, setClickEffect] = useState(false)

  useEffect(() => setMounted(true), [])

  // Always clear clickEffect after animation duration as a safety net
  useEffect(() => {
    if (!clickEffect) return
    const timer = setTimeout(() => setClickEffect(false), 600)
    return () => clearTimeout(timer)
  }, [clickEffect])

  const toggle = useCallback(() => {
    if (clickEffect) return
    setClickEffect(true)

    setTimeout(() => {
      if (isDark) {
        localStorage.setItem('gemach-theme', 'light')
        router.push(pathname === '/v2' ? '/' : pathname.replace('/v2', ''))
      } else {
        localStorage.setItem('gemach-theme', 'dark')
        router.push(pathname === '/' ? '/v2' : `/v2${pathname}`)
      }
    }, 300)
  }, [isDark, pathname, router, clickEffect])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggle}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors overflow-hidden ${
        isDark
          ? 'hover:bg-white/10 active:bg-white/20'
          : 'hover:bg-slate-100 active:bg-slate-200'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* Click ripple - ends at opacity 0 */}
      <AnimatePresence>
        {clickEffect && (
          <motion.div
            className={`absolute inset-0 rounded-full ${isDark ? 'bg-yellow-300/20' : 'bg-indigo-400/20'}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Sparkle particles - all end at opacity 0 and scale 0 */}
      <AnimatePresence>
        {clickEffect && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180
              return (
                <motion.div
                  key={angle}
                  className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-yellow-300' : 'bg-indigo-400'}`}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(rad) * 16,
                    y: Math.sin(rad) * 16,
                    scale: 0,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* Icon swap */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -120, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 120, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <SunIcon />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 120, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -120, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <MoonIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
