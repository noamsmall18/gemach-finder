'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface AnimatedHeroProps {
  count: number
}

export default function AnimatedHero({ count }: AnimatedHeroProps) {
  return (
    <div className="relative max-w-3xl mx-auto px-1">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center mb-4 sm:mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-sea" />
          <AnimatedCounter target={count} /> verified gemachs
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-heading text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-800"
      >
        Find What You Need.
        <br />
        <span className="text-navy">Borrow It Free.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"
      >
        The community directory of free lending services across Bergen County,
        Passaic County, and Rockland County. Baby gear, medical equipment, simcha supplies, and more.
      </motion.p>

      {/* Scroll indicator */}
      <motion.a
        href="#directory"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 sm:mt-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-400 hover:border-slate-300 transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </div>
  )
}
