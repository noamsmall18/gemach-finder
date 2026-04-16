'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const isDark = pathname.startsWith('/v2')
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggle = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // Let the exit animation play, then navigate
    setTimeout(() => {
      if (isDark) {
        localStorage.setItem('gemach-theme', 'light')
        router.push(pathname === '/v2' ? '/' : pathname.replace('/v2', ''))
      } else {
        localStorage.setItem('gemach-theme', 'dark')
        router.push(pathname === '/' ? '/v2' : `/v2${pathname}`)
      }
      setIsAnimating(false)
    }, 500)
  }

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={toggle}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors overflow-hidden ${
        isDark
          ? 'hover:bg-white/10'
          : 'hover:bg-slate-100'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* Burst rays on click */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute top-1/2 left-1/2 w-0.5 h-2 rounded-full ${
                  isDark ? 'bg-yellow-300' : 'bg-indigo-400'
                }`}
                style={{
                  transformOrigin: 'center center',
                  rotate: `${i * 45}deg`,
                }}
                initial={{ opacity: 0, scaleY: 0, x: '-50%', y: '-50%' }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [0, 1.5, 0],
                  x: '-50%',
                  y: '-50%',
                  translateY: [0, -14, -18],
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moon / Sun icon with swap animation */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
          >
            {/* Sun SVG */}
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
              animate={isAnimating ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <circle cx="12" cy="12" r="5" />
              {/* Sun rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 12 + 8 * Math.cos(rad)
                const y1 = 12 + 8 * Math.sin(rad)
                const x2 = 12 + 10 * Math.cos(rad)
                const y2 = 12 + 10 * Math.sin(rad)
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  />
                )
              })}
            </motion.svg>
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
          >
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
              animate={isAnimating ? { rotate: -30, scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <motion.path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </motion.svg>

            {/* Stars that twinkle in around the moon */}
            {[
              { x: 3, y: 5, delay: 0.1 },
              { x: 22, y: 3, delay: 0.2 },
              { x: 26, y: 16, delay: 0.3 },
            ].map((star, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-slate-400 rounded-full"
                style={{ left: star.x, top: star.y }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.7] }}
                transition={{ delay: star.delay, duration: 0.4, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
