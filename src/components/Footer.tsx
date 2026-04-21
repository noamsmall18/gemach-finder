'use client'

import Link from 'next/link'
import Image from 'next/image'
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
              <Image
                src="/logo.png"
                alt="GemachFinder"
                width={28}
                height={28}
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
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
                <Link href="/map" className="text-xs sm:text-sm hover:text-white transition-colors">Map</Link>
                <Link href="/requests" className="text-xs sm:text-sm hover:text-white transition-colors">Create</Link>
                <Link href="/suggest" className="text-xs sm:text-sm hover:text-white transition-colors">Missing One?</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 sm:mb-3">Info</h4>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm">{gemachCount} gemachs</span>
                <span className="text-xs sm:text-sm">8 categories</span>
                <Link href="/about" className="text-xs sm:text-sm hover:text-white transition-colors">About</Link>
                <Link href="/privacy" className="text-xs sm:text-sm hover:text-white transition-colors">Privacy</Link>
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
