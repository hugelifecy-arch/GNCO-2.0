import { CapitalCallManager } from '@/components/operator/CapitalCallManager'

export default function CapitalCallsPage() {
  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="space-y-3">
        <h1 className="font-serif text-3xl">Capital Calls</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Total Called YTD: <span className="text-accent-gold">$124M</span></div>
          <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Outstanding: <span className="text-accent-gold">$18.4M</span></div>
          <div className="rounded border border-bg-border bg-bg-surface px-4 py-3 text-sm">Overdue: <span className="text-accent-red">2 LPs</span></div>
        </div>
      </header>

      <CapitalCallManager />
    </main>
  )
}
