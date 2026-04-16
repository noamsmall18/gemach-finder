'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ThemeRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const saved = localStorage.getItem('gemach-theme')
    if (saved === 'dark' && !pathname.startsWith('/v2')) {
      router.replace(pathname === '/' ? '/v2' : `/v2${pathname}`)
    } else if (saved === 'light' && pathname.startsWith('/v2')) {
      router.replace(pathname === '/v2' ? '/' : pathname.replace('/v2', ''))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
