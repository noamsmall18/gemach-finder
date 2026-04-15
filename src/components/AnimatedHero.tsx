'use client'

import { motion } from 'framer-motion'
import HeroBadge from './HeroBadge'

interface AnimatedHeroProps {
  count: number
}

export default function AnimatedHero({ count }: AnimatedHeroProps) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <HeroBadge count={count} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold leading-[1.08] tracking-tight"
      >
        <span className="text-slate-800">Find What You Need.</span>
        <br />
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-gradient-to-r from-navy via-navy-light to-navy bg-[length:200%_auto] bg-clip-text text-transparent"
        >
          Borrow It Free.
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed"
      >
        The community directory of gemachs across Bergen County.
        Baby gear, medical equipment, simcha supplies, interest-free loans, and more.
      </motion.p>
    </div>
  )
}
