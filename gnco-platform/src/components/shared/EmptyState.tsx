import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  message: string
  actionLabel: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-bg-border bg-bg-elevated/40 p-6 text-center">
      <Icon className="mb-3 h-8 w-8 text-text-secondary" />
      <p className="mb-4 text-sm text-text-secondary">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="rounded-md border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold"
      >
        {actionLabel}
      </button>
    </div>
  )
}
