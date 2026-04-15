'use client'

import { useEffect, useState } from 'react'

export default function ScrollNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (!nav) return
    if (scrolled) {
      nav.style.background = 'rgba(255,255,255,0.88)'
      nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.05)'
      nav.style.borderColor = 'rgba(0,0,0,0.04)'
    } else {
      nav.style.background = ''
      nav.style.boxShadow = ''
      nav.style.borderColor = ''
    }
  }, [scrolled])

  return null
}
