'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, AlertCircle } from 'lucide-react'

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link
        href="/requests"
        className={`text-sm font-semibold px-2.5 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
          pathname === '/requests'
            ? 'text-white bg-gold shadow-sm'
            : 'text-gold bg-gold/8 hover:bg-gold/15'
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
