'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function DarkNavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <ThemeToggle />
      <Link
        href="/v2/map"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          pathname === '/v2/map'
            ? 'text-white bg-white/12 shadow-sm'
            : 'text-white/70 bg-white/[0.04] hover:bg-white/[0.08]'
        }`}
      >
        <Map className="w-4 h-4 sm:hidden" />
        <span className="hidden sm:inline">Map</span>
      </Link>
      <Link
        href="/requests"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-all ${
          pathname === '/requests'
            ? 'text-[#0B0F1A] bg-sea shadow-sm'
            : 'text-sea bg-sea/10 hover:bg-sea/20'
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
    </div>
  )
}
