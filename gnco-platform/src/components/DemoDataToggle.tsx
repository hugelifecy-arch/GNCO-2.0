'use client'

import type { DemoMode } from '@/hooks/useDemoMode'

interface DemoDataToggleProps {
  mode: DemoMode
  onChange: (mode: DemoMode) => void
}

export function DemoDataToggle({ mode, onChange }: DemoDataToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-bg-border bg-bg-surface p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange('sample')}
        className={`rounded px-3 py-1.5 transition ${
          mode === 'sample' ? 'bg-accent-gold/20 text-accent-gold' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        Load sample data
      </button>
      <button
        type="button"
        onClick={() => onChange('empty')}
        className={`rounded px-3 py-1.5 transition ${
          mode === 'empty' ? 'bg-accent-gold/20 text-accent-gold' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        Start empty
      </button>
    </div>
  )
}
