import { CapitalActivityTable } from '@/components/dashboard/CapitalActivityTable'
import { ExposureTreemap } from '@/components/dashboard/ExposureTreemap'
import { FundAllocationChart } from '@/components/dashboard/FundAllocationChart'
import { KPIStrip } from '@/components/dashboard/KPIStrip'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { RecentDocuments } from '@/components/dashboard/RecentDocuments'
import { SavedComparisons } from '@/components/dashboard/SavedComparisons'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import {
  MOCK_CAPITAL_CALLS,
  MOCK_DOCUMENTS,
  MOCK_EXPOSURE_FUNDS,
  MOCK_FUNDS,
  MOCK_KPI_SUMMARY,
  MOCK_PERFORMANCE_DATA,
} from '@/lib/mock-data'

export default function DashboardPage() {
  const recentDocuments = MOCK_DOCUMENTS.slice()
    .sort((a, b) => +new Date(b.uploadedDate) - +new Date(a.uploadedDate))
    .slice(0, 5)

  return (
    <main className="space-y-6 p-6 lg:p-8">
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


      <ErrorBoundary>
        <ExposureTreemap funds={MOCK_EXPOSURE_FUNDS} />
      </ErrorBoundary>

      <section className="grid gap-6 lg:grid-cols-2">
        <ErrorBoundary>
          <CapitalActivityTable calls={MOCK_CAPITAL_CALLS} />
        </ErrorBoundary>
        <ErrorBoundary>
          <FundAllocationChart funds={MOCK_FUNDS} />
        </ErrorBoundary>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ErrorBoundary>
          <RecentDocuments documents={recentDocuments} />
        </ErrorBoundary>
        <ErrorBoundary>
          <SavedComparisons />
        </ErrorBoundary>
      </section>
    </main>
  )
}
