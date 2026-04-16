'use client'

import { useEffect, useState } from 'react'

export default function DarkScrollNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const nav = document.querySelector('.dark-mode nav')
    if (!nav) return
    if (scrolled) {
      ;(nav as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)'
    } else {
      ;(nav as HTMLElement).style.boxShadow = ''
    }
  }, [scrolled])

  return null
}
