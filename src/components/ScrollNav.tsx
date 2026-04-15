'use client'

import { useEffect, useState } from 'react'

export default function ScrollNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <style>{`
      nav {
        ${scrolled
          ? 'background: rgba(255,255,255,0.85) !important; box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.04) !important;'
          : ''}
        transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
      }
    `}</style>
  )
}
