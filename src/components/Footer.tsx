'use client'

import Link from 'next/link'
import { ArrowUp } from 'lucide-react'

interface FooterProps {
  gemachCount: number
}

export default function Footer({ gemachCount }: FooterProps) {
  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="sm:w-[14px] sm:h-[14px]">
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#C9971A"/>
                  <circle cx="12" cy="10" r="3.5" fill="white"/>
                </svg>
              </div>
              <span className="font-heading text-sm sm:text-base font-bold text-white">GemachFinder</span>
            </Link>
            <p className="text-xs sm:text-sm text-white/40 mt-2 sm:mt-3 leading-relaxed">
              A community resource for Bergen, Passaic & Rockland Counties. {gemachCount} verified gemachs and growing.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 sm:gap-12">
            <div>
              <h4 className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 sm:mb-3">Navigate</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link href="/" className="text-xs sm:text-sm hover:text-white transition-colors">Directory</Link>
                <Link href="/requests" className="text-xs sm:text-sm hover:text-white transition-colors">Create</Link>
                <Link href="/suggest" className="text-xs sm:text-sm hover:text-white transition-colors">Missing One?</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 sm:mb-3">Info</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm">{gemachCount} gemachs</span>
                <span className="text-xs sm:text-sm">7 categories</span>
                <span className="text-xs sm:text-sm">100% free</span>
              </div>
            </div>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs sm:text-sm text-white/40 hover:text-white/70 active:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Top
          </button>
        </div>

        <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/8">
          <p className="text-[10px] sm:text-xs text-white/25">
            Data is community-sourced and verified. Contact info may change - please verify before visiting. Built by Noam Small.
          </p>
        </div>
      </div>
    </footer>
  )
}
