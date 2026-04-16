'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function DarkNavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/requests"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/requests'
            ? 'text-[#0B0F1A] bg-gold shadow-sm'
            : 'text-gold bg-gold/10 hover:bg-gold/20'
        }`}
      >
        Create
      </Link>
      <Link
        href="/suggest"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/suggest'
            ? 'text-white bg-red-500 shadow-sm'
            : 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
        }`}
      >
        Missing One?
      </Link>
      <ThemeToggle />
    </div>
  )
}
