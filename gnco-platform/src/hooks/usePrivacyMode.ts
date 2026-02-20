'use client'

import { useContext } from 'react'

import { PrivacyModeContext } from '@/context/PrivacyModeContext'

export function formatPrivate(value: string | number, type: 'currency' | 'name' | 'percent', privacyMode: boolean) {
  if (!privacyMode) return value
  if (type === 'percent') return value
  return '●●●●'
}

export function usePrivacyMode() {
  const context = useContext(PrivacyModeContext)

  if (!context) {
    throw new Error('usePrivacyMode must be used inside PrivacyModeProvider')
  }

  return context
}
