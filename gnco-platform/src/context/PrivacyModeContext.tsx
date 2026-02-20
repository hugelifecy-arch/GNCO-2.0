'use client'

import { Circle } from 'lucide-react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { formatPrivate as formatPrivateValue, type NameScope, type PrivacyFormatType } from '@/lib/privacy-mode'

type PrivacyModeContextValue = {
  privacyMode: boolean
  isPrivacyMode: boolean
  toggle: () => void
  togglePrivacyMode: () => void
  setPrivacyMode: (enabled: boolean) => void
  formatPrivate: (value: number | string, type: PrivacyFormatType, scope?: NameScope, compact?: boolean) => string
  getAlias: (name: string, scope: NameScope) => string
}

export const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(null)

function toFundAlias(index: number) {
  const alphabetIndex = index % 26
  const suffix = index >= 26 ? `-${Math.floor(index / 26) + 1}` : ''
  return `Fund-${String.fromCharCode(65 + alphabetIndex)}${suffix}`
}

export function PrivacyModeProvider({ children }: { children: ReactNode }) {
  const [privacyMode, setPrivacyMode] = useState(false)
  const lpAliases = useRef(new Map<string, string>())
  const fundAliases = useRef(new Map<string, string>())

  const toggle = useCallback(() => {
    setPrivacyMode((prev) => !prev)
  }, [])

  const getAlias = useCallback((name: string, scope: NameScope) => {
    const map = scope === 'fund' ? fundAliases.current : lpAliases.current

    if (map.has(name)) {
      return map.get(name) as string
    }

    const alias = scope === 'fund' ? toFundAlias(map.size) : `LP-${String(map.size + 1).padStart(2, '0')}`
    map.set(name, alias)

    return alias
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.key.toLowerCase() !== 'p') return
      event.preventDefault()
      toggle()
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  const contextValue = useMemo<PrivacyModeContextValue>(
    () => ({
      privacyMode,
      isPrivacyMode: privacyMode,
      toggle,
      togglePrivacyMode: toggle,
      setPrivacyMode,
      formatPrivate: (value, type, scope = 'lp', compact = true) =>
        formatPrivateValue(value, type, { isPrivacyMode: privacyMode, scope, getAlias, compact }),
      getAlias,
    }),
    [getAlias, privacyMode, toggle]
  )

  return (
    <PrivacyModeContext.Provider value={contextValue}>
      {privacyMode ? (
        <>
          <div className="fixed inset-x-0 top-0 z-[72] border-b border-accent-red/30 bg-accent-red/10 px-4 py-1 text-center text-xs text-accent-red backdrop-blur-sm">
            Privacy Mode Active
          </div>
          <div className="fixed right-4 top-4 z-[73]" title="Privacy Mode Active — sensitive values hidden">
            <Circle className="h-3 w-3 fill-accent-red text-accent-red" />
          </div>
        </>
      ) : null}
      {children}
    </PrivacyModeContext.Provider>
  )
}
