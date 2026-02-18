'use client'

import { useEffect, useState } from 'react'

export type DemoMode = 'sample' | 'empty'

const STORAGE_KEY = 'gnco_demo_mode'

export function useDemoMode(defaultMode: DemoMode = 'sample') {
  const [mode, setMode] = useState<DemoMode>(defaultMode)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'sample' || stored === 'empty') {
      setMode(stored)
    }
  }, [])

  const updateMode = (nextMode: DemoMode) => {
    setMode(nextMode)
    window.localStorage.setItem(STORAGE_KEY, nextMode)
  }

  return { mode, setMode: updateMode, storageKey: STORAGE_KEY }
}
