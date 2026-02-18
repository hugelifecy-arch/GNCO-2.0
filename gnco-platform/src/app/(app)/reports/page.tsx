'use client'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { useDemoMode } from '@/hooks/useDemoMode'

export default function ReportsPage() {
  const { mode, setMode } = useDemoMode()

  return (
    <main className="space-y-4 p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">Reports</p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-serif text-3xl text-text-primary">ILPA Report Generator</h1>
            <DemoDatasetBadge />
          </div>
        </div>
        <DemoDataToggle mode={mode} onChange={setMode} />
      </div>
      <div className="rounded-lg border border-dashed border-bg-border bg-bg-elevated/40 p-8 text-sm text-text-secondary">Coming Soon</div>
    </main>
  )
}
