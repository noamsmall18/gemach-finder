'use client'

import { motion } from 'framer-motion'
import { Search, Heart, Users, ArrowDown } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface AnimatedHeroProps {
  count: number
}

export default function AnimatedHero({ count }: AnimatedHeroProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy/[0.04] text-navy text-xs font-bold border border-navy/[0.06]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
          </span>
          <AnimatedCounter target={count} /> verified gemachs and growing
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="font-heading text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
      >
        <span className="text-slate-800">Find What You Need.</span>
        <br />
        <span className="bg-gradient-to-r from-navy via-navy-light to-navy bg-clip-text text-transparent">Borrow It Free.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
      >
        The community directory of free lending services across Bergen County.
        Baby gear, medical equipment, simcha supplies, interest-free loans, and more.
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-3 mt-8 md:mt-10"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-100 text-sm text-slate-500 font-medium">
          <Search className="w-4 h-4 text-navy/50" />
          Search anything
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-100 text-sm text-slate-500 font-medium">
          <Heart className="w-4 h-4 text-gold" />
          100% free
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-100 text-sm text-slate-500 font-medium">
          <Users className="w-4 h-4 text-sage" />
          Community verified
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 md:mt-14 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  )
}
