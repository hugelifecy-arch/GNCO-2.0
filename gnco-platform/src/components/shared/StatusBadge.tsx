import { cn, getStatusVariant } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  label?: string
}

const variantClassMap: Record<'success' | 'warning' | 'error' | 'neutral', string> = {
  success: 'border-accent-green/20 bg-accent-green/10 text-accent-green',
  warning: 'border-accent-amber/20 bg-accent-amber/10 text-accent-amber',
  error: 'border-accent-red/20 bg-accent-red/10 text-accent-red',
  neutral: 'border-bg-border bg-bg-border/50 text-text-secondary',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variant = getStatusVariant(status)

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', variantClassMap[variant])}>
      {label ?? status}
    </span>
  )
}
