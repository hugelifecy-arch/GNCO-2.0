'use client'

import { Coins } from 'lucide-react'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { CapitalCallManager } from '@/components/operator/CapitalCallManager'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDemoMode } from '@/hooks/useDemoMode'

export default function CapitalCallsPage() {
  const { mode, setMode } = useDemoMode()
  const hasSampleData = mode === 'sample'

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl">Capital Calls</h1>
            <DemoDatasetBadge />
          </div>
          <DemoDataToggle mode={mode} onChange={setMode} />
        </div>
        {hasSampleData ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Total Called YTD: <span className="text-accent-gold">$124M</span></div>
            <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Outstanding: <span className="text-accent-gold">$18.4M</span></div>
            <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Overdue: <span className="text-accent-red">2 LPs</span></div>
          </div>
        ) : null}
      </header>

      {hasSampleData ? <CapitalCallManager /> : <EmptyState icon={Coins} message="No capital calls loaded in Start empty mode." actionLabel="Load sample data" onAction={() => setMode('sample')} />}
      <p className="text-xs text-text-tertiary">All call notices and actions are demo-only in open beta.</p>
    </main>
  )
}
