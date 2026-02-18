'use client'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { IntakeWizard } from '@/components/architect/IntakeWizard'
import { useDemoMode } from '@/hooks/useDemoMode'

export default function ArchitectPage() {
  const { mode, setMode } = useDemoMode()

  return (
    <main className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-serif">Architect Engine</h1>
          <DemoDatasetBadge />
        </div>
        <DemoDataToggle mode={mode} onChange={setMode} />
      </div>
      <IntakeWizard />
    </main>
  )
}
