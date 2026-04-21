'use client'

import Link from 'next/link'
import Image from 'next/image'
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
          <Image
            src="/logo.png"
            alt="GemachFinder"
            width={36}
            height={36}
            priority
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
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
