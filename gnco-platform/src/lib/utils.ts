import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  compact = false,
  currency = 'EUR'
): string {
  if (compact) {
    if (amount >= 1_000_000_000) return `€${(amount / 1_000_000_000).toFixed(1)}B`
    if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000) return `€${(amount / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(
  dateStr: string,
  format: 'short' | 'long' | 'month-year' = 'short'
): string {
  const date = new Date(dateStr)
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  if (format === 'month-year') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent-green'
  if (score >= 60) return 'text-accent-gold'
  if (score >= 40) return 'text-accent-amber'
  return 'text-accent-red'
}

export function getStatusVariant(
  status: string
): 'success' | 'warning' | 'error' | 'neutral' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
    complete: 'success',
    paid: 'success',
    approved: 'success',
    signed: 'success',
    full: 'success',
    active: 'success',
    pending: 'warning',
    partial: 'warning',
    'partially-paid': 'warning',
    overdue: 'error',
    incomplete: 'error',
    declined: 'error',
    draft: 'neutral',
    'coming-soon': 'neutral',
  }
  return map[status] ?? 'neutral'
}
