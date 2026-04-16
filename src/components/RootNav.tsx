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
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.68 12.07a.5.5 0 0 0 .64 0C13 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="#C9971A"/>
              <circle cx="12" cy="10" r="3.5" fill="white"/>
            </svg>
          </div>
          <span className="font-heading text-xl font-bold text-navy">GemachFinder</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NavLinks />
        </div>
      </div>
    </nav>
  )
}
