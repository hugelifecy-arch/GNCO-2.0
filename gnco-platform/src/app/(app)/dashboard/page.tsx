'use client'

import { BarChart3 } from 'lucide-react'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { CapitalActivityTable } from '@/components/dashboard/CapitalActivityTable'
import { FundAllocationChart } from '@/components/dashboard/FundAllocationChart'
import { KPIStrip } from '@/components/dashboard/KPIStrip'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { RecentDocuments } from '@/components/dashboard/RecentDocuments'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { useDemoMode } from '@/hooks/useDemoMode'
import { MOCK_CAPITAL_CALLS, MOCK_DOCUMENTS, MOCK_FUNDS, MOCK_KPI_SUMMARY, MOCK_PERFORMANCE_DATA } from '@/lib/mock-data'

export default function DashboardPage() {
  const { mode, setMode } = useDemoMode()
  const hasSampleData = mode === 'sample'

  const recentDocuments = hasSampleData
    ? MOCK_DOCUMENTS.slice().sort((a, b) => +new Date(b.uploadedDate) - +new Date(a.uploadedDate)).slice(0, 5)
    : []

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl">Dashboard</h1>
          <DemoDatasetBadge />
        </div>
        <DemoDataToggle mode={mode} onChange={setMode} />
      </header>

      {!hasSampleData ? (
        <EmptyState icon={BarChart3} message="Start empty mode is active. Load sample data to preview dashboard analytics." actionLabel="Load sample data" onAction={() => setMode('sample')} />
      ) : (
        <>
          <ErrorBoundary>
            <KPIStrip
              totalAUM={MOCK_KPI_SUMMARY.totalAUM}
              netIRR={MOCK_KPI_SUMMARY.netIRR}
              unfundedCommitments={MOCK_KPI_SUMMARY.unfundedCommitments}
              totalLPs={MOCK_KPI_SUMMARY.totalLPs}
              activeFunds={MOCK_KPI_SUMMARY.activeFunds}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <PerformanceChart data={MOCK_PERFORMANCE_DATA} />
          </ErrorBoundary>
          <section className="grid gap-6 lg:grid-cols-2">
            <ErrorBoundary>
              <CapitalActivityTable calls={MOCK_CAPITAL_CALLS} />
            </ErrorBoundary>
            <ErrorBoundary>
              <FundAllocationChart funds={MOCK_FUNDS} />
            </ErrorBoundary>
          </section>
          <ErrorBoundary>
            <RecentDocuments documents={recentDocuments} />
          </ErrorBoundary>
        </>
      )}
    </main>
  )
}
