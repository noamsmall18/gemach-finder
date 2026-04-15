'use client'

import { motion } from 'framer-motion'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-cream-dark/50" />

      {/* Animated orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-5%] left-[40%] w-[600px] h-[600px] bg-gradient-radial from-gold/[0.07] via-gold/[0.02] to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 15, -25, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[-8%] w-[450px] h-[450px] bg-gradient-radial from-navy/[0.05] to-transparent rounded-full blur-3xl hidden md:block"
      />
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] left-[-3%] w-[350px] h-[350px] bg-gradient-radial from-sage/[0.05] to-transparent rounded-full blur-3xl hidden md:block"
      />

      {/* Grid dots */}
      <div className="absolute inset-0 hidden lg:block" style={{
        backgroundImage: 'radial-gradient(circle, rgba(30,42,94,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/30 to-transparent" />
    </div>
  )
}
