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
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
    } else {
      nav.style.boxShadow = ''
    }
  }, [scrolled])

  return null
}
