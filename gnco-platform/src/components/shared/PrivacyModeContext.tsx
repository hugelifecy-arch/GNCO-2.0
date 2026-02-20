'use client'

import { Eye, EyeOff } from 'lucide-react'

export { PrivacyModeProvider } from '@/context/PrivacyModeContext'
export { usePrivacyMode } from '@/hooks/usePrivacyMode'

import { usePrivacyMode } from '@/hooks/usePrivacyMode'

export function PrivacyModeToggleButton() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyMode()

  return (
    <button
      type="button"
      onClick={togglePrivacyMode}
      className="flex items-center gap-1 text-text-secondary transition hover:text-text-primary"
      aria-label="Toggle Privacy Mode"
      title={isPrivacyMode ? 'Disable Privacy Mode (⌘/Ctrl+Shift+P)' : 'Enable Privacy Mode (⌘/Ctrl+Shift+P)'}
    >
      <span className="text-sm" aria-hidden>
        👁
      </span>
      {isPrivacyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}
