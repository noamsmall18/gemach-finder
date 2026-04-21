'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, AlertCircle, Map } from 'lucide-react'

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link
        href="/map"
        className={`text-sm font-semibold px-2.5 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          pathname === '/map'
            ? 'text-white bg-navy shadow-sm'
            : 'text-navy bg-navy/8 hover:bg-navy/15'
        }`}
      >
        <Map className="w-3.5 h-3.5 sm:hidden" />
        <span className="hidden sm:inline">Map</span>
      </Link>
      <Link
        href="/requests"
        className={`text-sm font-semibold px-2.5 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          pathname === '/requests'
            ? 'text-white bg-sea shadow-sm'
            : 'text-sea bg-sea/8 hover:bg-sea/15'
        }`}
      >
        <Plus className="w-3.5 h-3.5 sm:hidden" />
        <span className="hidden sm:inline">Create</span>
      </Link>
      <Link
        href="/suggest"
        className={`text-sm font-semibold px-2.5 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          pathname === '/suggest'
            ? 'text-white bg-red-500 shadow-sm'
            : 'text-red-500 bg-red-500/8 hover:bg-red-500/15'
        }`}
      >
        <AlertCircle className="w-3.5 h-3.5 sm:hidden" />
        <span className="hidden sm:inline">Missing One?</span>
      </Link>
    </div>
  )
}
