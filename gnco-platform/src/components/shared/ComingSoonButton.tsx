import type { ReactNode } from 'react'

export function ComingSoonButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      aria-label="Coming soon"
      className={`cursor-not-allowed rounded border border-bg-border px-4 py-2 text-sm text-text-tertiary opacity-70 ${className}`}
    >
      {children}
    </button>
  )
}
