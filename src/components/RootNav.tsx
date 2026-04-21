'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavLinks from './NavLinks'
import ThemeToggle from './ThemeToggle'

export default function RootNav() {
  const pathname = usePathname()

  // Hide root nav on /v2 routes - they have their own dark nav
  if (pathname.startsWith('/v2')) return null

  return (
    <nav className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-slate-200/60">
      <div className="w-full px-3 sm:px-4 md:px-6 h-12 sm:h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[18px] sm:h-[18px]">
              <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#5E94B8"/>
              <circle cx="12" cy="10" r="3.5" fill="white"/>
            </svg>
          </div>
          <span className="font-heading text-lg sm:text-xl font-bold text-navy">GemachFinder</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          <NavLinks />
        </div>
      </div>
    </nav>
  )
}
