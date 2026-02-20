'use client'

import { Circle, Eye, EyeOff } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { formatPrivate, type NameScope, type PrivacyFormatType } from '@/lib/privacy-mode'

type PrivacyModeContextValue = {
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
  setPrivacyMode: (enabled: boolean) => void
  formatPrivate: (value: number | string, type: PrivacyFormatType, scope?: NameScope, compact?: boolean) => string
  getAlias: (name: string, scope: NameScope) => string
}

const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(null)

function toFundAlias(index: number) {
  const alphabetIndex = index % 26
  const suffix = index >= 26 ? `-${Math.floor(index / 26) + 1}` : ''
  return `Fund-${String.fromCharCode(65 + alphabetIndex)}${suffix}`
}

export function PrivacyModeProvider({ children }: { children: ReactNode }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)
  const lpAliases = useRef(new Map<string, string>())
  const fundAliases = useRef(new Map<string, string>())

  const getAlias = useCallback((name: string, scope: NameScope) => {
    const map = scope === 'fund' ? fundAliases.current : lpAliases.current

    if (map.has(name)) {
      return map.get(name) as string
    }

    const alias =
      scope === 'fund'
        ? toFundAlias(map.size)
        : `LP-${String(map.size + 1).padStart(2, '0')}`

    map.set(name, alias)
    return alias
  }, [])

  const value = useMemo<PrivacyModeContextValue>(() => ({
    isPrivacyMode,
    togglePrivacyMode: () => setIsPrivacyMode((prev) => !prev),
    setPrivacyMode: setIsPrivacyMode,
    formatPrivate: (target, type, scope = 'lp', compact = true) =>
      formatPrivate(target, type, { isPrivacyMode, scope, getAlias, compact }),
    getAlias,
  }), [getAlias, isPrivacyMode])

  return (
    <PrivacyModeContext.Provider value={value}>
      <PrivacyModeHotkey />
      {children}
      {isPrivacyMode ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[70]" title="Privacy Mode Active — absolute values hidden">
          <Circle className="h-3 w-3 fill-accent-red text-accent-red" />
        </div>
      ) : null}
    </PrivacyModeContext.Provider>
  )
}

function PrivacyModeHotkey() {
  const { togglePrivacyMode } = usePrivacyMode()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || !event.shiftKey) return
      if (event.key.toLowerCase() !== 'p') return

      event.preventDefault()
      togglePrivacyMode()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePrivacyMode])

  return null
}

export function PrivacyModeToggleButton() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyMode()

  return (
    <button
      type="button"
      onClick={togglePrivacyMode}
      className="text-text-secondary transition hover:text-text-primary"
      aria-label="Toggle Privacy Mode"
      title={isPrivacyMode ? 'Disable Privacy Mode (⌘/Ctrl+Shift+P)' : 'Enable Privacy Mode (⌘/Ctrl+Shift+P)'}
    >
      {isPrivacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}

export function usePrivacyMode() {
  const context = useContext(PrivacyModeContext)
  if (!context) {
    throw new Error('usePrivacyMode must be used inside PrivacyModeProvider')
  }

  return context
}
