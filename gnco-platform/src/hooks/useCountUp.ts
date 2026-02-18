'use client'

import { RefObject, useEffect, useState } from 'react'

interface UseCountUpProps {
  end: number
  duration?: number
  start?: number
  decimals?: number
}

export function useCountUp(
  { end, duration = 1200, start = 0, decimals = 0 }: UseCountUpProps,
  targetRef?: RefObject<Element>
) {
  const [value, setValue] = useState(start)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(!targetRef)

  useEffect(() => {
    if (!targetRef?.current) {
      setHasEnteredViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredViewport(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(targetRef.current)

    return () => observer.disconnect()
  }, [targetRef])

  useEffect(() => {
    if (!hasEnteredViewport) return

    let animationFrame = 0
    const startedAt = performance.now()

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const current = start + (end - start) * progress
      setValue(Number(current.toFixed(decimals)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [decimals, duration, end, hasEnteredViewport, start])

  return value
}
