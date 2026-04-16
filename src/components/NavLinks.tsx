'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hidden sm:block px-3 py-1.5 rounded-lg ${
          pathname === '/'
            ? 'text-navy bg-navy/5'
            : 'text-slate-500 hover:text-navy hover:bg-slate-50'
        }`}
      >
        Directory
      </Link>
      <Link
        href="/requests"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/requests'
            ? 'text-white bg-gold shadow-sm'
            : 'text-gold bg-gold/8 hover:bg-gold/15'
        }`}
      >
        <span className="hidden sm:inline">Vote</span>
        <span className="sm:hidden">Vote</span>
      </Link>
      <Link
        href="/suggest"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/suggest'
            ? 'text-white bg-navy shadow-sm'
            : 'text-navy bg-navy/5 hover:bg-navy/10'
        }`}
      >
        <span className="hidden sm:inline">+ Missing</span>
        <span className="sm:hidden">+</span>
      </Link>
    </div>
  )
}
