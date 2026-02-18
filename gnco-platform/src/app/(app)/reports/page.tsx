import Link from 'next/link'

const ilpaHeaders = [
  'fund_name',
  'reporting_period',
  'lp_name',
  'commitment_usd',
  'called_capital_usd',
  'distributed_usd',
  'nav_usd',
  'irr_pct',
  'tvpi_multiple',
]

export default function ReportsPage() {
  return (
    <main className="space-y-4 p-6 lg:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-text-tertiary">Reports</p>
      <h1 className="font-serif text-3xl text-text-primary">ILPA Report Generator</h1>

      <div className="rounded-xl border border-bg-border bg-bg-surface p-6 space-y-3">
        <p className="text-sm text-text-secondary">Export ILPA CSV (Beta)</p>
        <p className="text-xs text-text-tertiary">Beta export template only. Not audited.</p>
        <Link href="/api/export/ilpa-csv" className="inline-flex rounded-md border border-accent-gold px-4 py-2 text-sm text-accent-gold">
          Export ILPA CSV (Beta)
        </Link>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Documented headers</p>
          <p className="mt-1 text-sm text-text-secondary">{ilpaHeaders.join(', ')}</p>
        </div>
      </div>
    </main>
  )
}
