import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { GLOBAL_LAST_UPDATED } from '@/lib/data-sources'

function formatRange(min: number, max: number) {
  return `$${Math.round(min / 1000)}K–$${Math.round(max / 1000)}K`
}

export default function JurisdictionDetailPage({ params }: { params: { jurisdictionId: string } }) {
  const jurisdiction = JURISDICTIONS.find((item) => item.id === params.jurisdictionId)
  if (!jurisdiction) notFound()

  const metadata = JURISDICTION_METADATA[jurisdiction.id]

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-14">
      <Link href="/coverage" className="text-sm text-accent-gold">← Back to coverage</Link>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <p className="text-3xl">{jurisdiction.flag}</p>
        <h1 className="mt-2 font-serif text-4xl">{jurisdiction.name}</h1>
        <p className="mt-2 text-text-secondary">{jurisdiction.notes}</p>
        <p className="mt-4 text-sm text-text-secondary">Regulator: {jurisdiction.regulator}</p>
      </section>

      <section className="grid gap-4 rounded-xl border border-bg-border bg-bg-surface p-6 md:grid-cols-3">
        <Metric label="Formation cost" value={formatRange(jurisdiction.formationCostRange.min, jurisdiction.formationCostRange.max)} />
        <Metric label="Annual cost" value={formatRange(jurisdiction.annualCostRange.min, jurisdiction.annualCostRange.max)} />
        <Metric label="Setup timeline" value={`${jurisdiction.setupTimeWeeks.min}–${jurisdiction.setupTimeWeeks.max} weeks`} />
      </section>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-lg font-semibold">Vehicles</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-text-secondary">
          {jurisdiction.primaryVehicles.map((vehicle) => <li key={vehicle}>{vehicle}</li>)}
        </ul>
      </section>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-lg font-semibold">Sources</h2>
        <p className="mt-1 text-sm text-text-secondary">Last updated: {metadata?.lastUpdated ?? GLOBAL_LAST_UPDATED}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-secondary">
          {(metadata?.sources ?? []).map((source) => (
            <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="text-accent-gold">{source.label}</a></li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-elevated p-4">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-1 text-lg text-text-primary">{value}</p>
    </div>
  )
}
