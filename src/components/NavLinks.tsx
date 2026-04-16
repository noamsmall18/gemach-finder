'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/requests"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/requests'
            ? 'text-white bg-gold shadow-sm'
            : 'text-gold bg-gold/8 hover:bg-gold/15'
        }`}
      >
        Create
      </Link>
      <Link
        href="/suggest"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/suggest'
            ? 'text-white bg-navy shadow-sm'
            : 'text-navy bg-navy/5 hover:bg-navy/10'
        }`}
      >
        Missing One
      </Link>
    </div>
  )
}
