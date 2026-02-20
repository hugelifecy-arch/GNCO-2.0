import { formatCurrency, formatPercent } from '@/lib/utils'

export type PrivacyFormatType = 'currency' | 'name' | 'percent'

export type NameScope = 'lp' | 'fund'

export function formatPrivate(
  value: number | string,
  type: PrivacyFormatType,
  options: {
    isPrivacyMode: boolean
    scope?: NameScope
    getAlias?: (name: string, scope: NameScope) => string
    compact?: boolean
  }
): string {
  const { isPrivacyMode, scope = 'lp', getAlias, compact = true } = options

  if (type === 'currency') {
    if (isPrivacyMode) return '●●●●'
    return formatCurrency(Number(value), compact)
  }

  if (type === 'percent') {
    if (typeof value === 'number') {
      return formatPercent(value, 1)
    }
    return String(value)
  }

  if (!isPrivacyMode) return String(value)

  if (getAlias) {
    return getAlias(String(value), scope)
  }

  return scope === 'fund' ? 'Fund-A' : 'LP-01'
}
