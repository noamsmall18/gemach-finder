'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target: number
  duration?: number
}

export default function AnimatedCounter({ target, duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(target)
  const startedRef = useRef(false)

  useEffect(() => {
    if (target === 0 || startedRef.current) return
    startedRef.current = true
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return <>{count}</>
}
