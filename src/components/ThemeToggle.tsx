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
      {/* Core circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      />
      {/* Rays - each one grows outward with stagger */}
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

  const toggle = useCallback(() => {
    // Trigger the click ripple
    setClickEffect(true)

    // Navigate after a brief moment so user sees the effect
    setTimeout(() => {
      if (isDark) {
        localStorage.setItem('gemach-theme', 'light')
        router.push(pathname === '/v2' ? '/' : pathname.replace('/v2', ''))
      } else {
        localStorage.setItem('gemach-theme', 'dark')
        router.push(pathname === '/' ? '/v2' : `/v2${pathname}`)
      }
      setClickEffect(false)
    }, 350)
  }, [isDark, pathname, router])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggle}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        isDark
          ? 'hover:bg-white/10 active:bg-white/20'
          : 'hover:bg-slate-100 active:bg-slate-200'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* Click ripple */}
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

      {/* Sparkle particles on click */}
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
                    x: Math.cos(rad) * 20,
                    y: Math.sin(rad) * 20,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
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
            className="relative"
            initial={{ rotate: 120, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -120, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <MoonIcon />
            {/* Stars */}
            {[
              { angle: -40, dist: 14, size: 3, delay: 0.3 },
              { angle: -80, dist: 16, size: 2, delay: 0.45 },
              { angle: 20, dist: 15, size: 2.5, delay: 0.55 },
            ].map((star, i) => {
              const rad = (star.angle * Math.PI) / 180
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-slate-400/70"
                  style={{
                    width: star.size,
                    height: star.size,
                    top: `calc(50% + ${Math.sin(rad) * star.dist}px)`,
                    left: `calc(50% + ${Math.cos(rad) * star.dist}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.4, 1],
                    opacity: [0, 0.8, 0.5],
                  }}
                  transition={{
                    delay: star.delay,
                    duration: 0.35,
                    ease: 'easeOut',
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
