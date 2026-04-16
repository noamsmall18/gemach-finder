'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const isDark = pathname.startsWith('/v2')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggle = () => {
    if (isDark) {
      localStorage.setItem('gemach-theme', 'light')
      // Map /v2 sub-routes back to their light equivalents
      router.push(pathname === '/v2' ? '/' : pathname.replace('/v2', ''))
    } else {
      localStorage.setItem('gemach-theme', 'dark')
      router.push(pathname === '/' ? '/v2' : `/v2${pathname}`)
    }
  }

  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={toggle}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        isDark
          ? 'hover:bg-white/10 text-yellow-300'
          : 'hover:bg-slate-100 text-slate-400'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
