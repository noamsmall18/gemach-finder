'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Directory' },
    { href: '/requests', label: 'Requests' },
  ]

  return (
    <div className="flex items-center gap-6">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm font-medium transition-colors hidden sm:block ${
            pathname === href
              ? 'text-navy'
              : 'text-slate-500 hover:text-navy'
          }`}
        >
          {label}
        </Link>
      ))}
      <Link
        href="/suggest"
        className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${
          pathname === '/suggest'
            ? 'text-white bg-navy'
            : 'text-navy bg-navy/5 hover:bg-navy/10'
        }`}
      >
        <span className="hidden sm:inline">+ Suggest</span>
        <span className="sm:hidden">+</span>
      </Link>
    </div>
  )
}
