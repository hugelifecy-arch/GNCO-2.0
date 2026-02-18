'use client'

import dynamic from 'next/dynamic'
import { Calculator } from 'lucide-react'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDemoMode } from '@/hooks/useDemoMode'

const WaterfallCalculator = dynamic(() => import('@/components/operator/WaterfallCalculator').then((mod) => mod.WaterfallCalculator))

export default function DistributionsPage() {
  const { mode, setMode } = useDemoMode()
  const hasSampleData = mode === 'sample'

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl">Distribution &amp; Waterfall Calculator</h1>
          <DemoDatasetBadge />
        </div>
        <DemoDataToggle mode={mode} onChange={setMode} />
      </div>
      {hasSampleData ? <WaterfallCalculator /> : <EmptyState icon={Calculator} message="Start empty mode is active for distributions." actionLabel="Load sample data" onAction={() => setMode('sample')} />}
      <p className="text-xs text-text-tertiary">Distribution calculations are provided as demo workflow previews.</p>
    </main>
  )
}
