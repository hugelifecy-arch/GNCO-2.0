import Link from 'next/link'
import { notFound } from 'next/navigation'

import { COMPLIANCE_OBLIGATIONS } from '@/data/compliance-obligations'
import { REGULATORY_UPDATES } from '@/data/regulatory-updates'
import { JURISDICTIONS_CANONICAL } from '@/data/jurisdictions'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { scoreJurisdiction, type FundStrategy } from '@/lib/jurisdiction-scoring'

const STRATEGY_LABELS: { strategy: FundStrategy; label: string }[] = [
  { strategy: 'private-equity', label: 'PE' },
  { strategy: 'venture-capital', label: 'VC' },
  { strategy: 'real-estate', label: 'RE' },
  { strategy: 'private-credit', label: 'Credit' },
]

const MIN_AUM_BY_JURISDICTION: Record<string, string> = {
  'cayman-islands': 'USD 0 (market practice: USD 25M+)',
  luxembourg: 'EUR 1.25M',
  delaware: 'USD 0',
  singapore: 'SGD 5M (tax incentive pathways)',
  ireland: 'EUR 100K per investor (QIAIF)',
  bvi: 'USD 0 (professional fund pathways)',
  jersey: 'GBP 0 (JPF: 50 investor cap)',
  guernsey: 'GBP 0 (PIF-specific rules apply)',
  mauritius: 'USD 0',
  'hong-kong': 'HKD 0 (LPF regime)',
  netherlands: 'No statutory minimum (substance-driven)',
  bermuda: 'USD 0',
  switzerland: 'CHF 500K investor qualification threshold',
  cyprus: 'EUR 500K (AIFLNP investor commitment)',
  difc: 'USD 500K (QIF investor minimum)',
}

export function generateStaticParams() {
  return JURISDICTIONS.map((jurisdiction) => ({ slug: jurisdiction.id }))
}

export default function JurisdictionDetailPage({ params }: { params: { slug: string } }) {
  const jurisdiction = JURISDICTIONS.find((item) => item.id === params.slug)

  if (!jurisdiction) {
    notFound()
  }

  const metadata = JURISDICTION_METADATA[jurisdiction.id]
  const canonical = JURISDICTIONS_CANONICAL.find((item) => item.id === jurisdiction.id)
  const obligations = COMPLIANCE_OBLIGATIONS.filter((entry) => entry.jurisdiction_id === jurisdiction.id)
  const updates = REGULATORY_UPDATES.filter(
    (entry) => entry.jurisdiction_id === jurisdiction.id && entry.status === 'active',
  )

  const vehicleRows = jurisdiction.primaryVehicles.map((vehicle, index) => {
    const vehicleCount = jurisdiction.primaryVehicles.length
    const spreadFactor = vehicleCount > 1 ? index / (vehicleCount - 1) : 0.5

    const formation = Math.round(
      jurisdiction.formationCostRange.min +
        (jurisdiction.formationCostRange.max - jurisdiction.formationCostRange.min) * spreadFactor,
    )

    const annual = Math.round(
      jurisdiction.annualCostRange.min +
        (jurisdiction.annualCostRange.max - jurisdiction.annualCostRange.min) * spreadFactor,
    )

    const timelineMin = Math.max(1, Math.round(jurisdiction.setupTimeWeeks.min + spreadFactor))
    const timelineMax = Math.max(timelineMin, Math.round(jurisdiction.setupTimeWeeks.max + spreadFactor))

    return {
      vehicle,
      formation,
      annual,
      timeline: `${timelineMin}-${timelineMax} weeks`,
    }
  })

  const suitability = STRATEGY_LABELS.map(({ strategy, label }) => ({
    label,
    score: Math.max(
      1,
      Math.min(10, Math.round(scoreJurisdiction(jurisdiction.id, { fundSize: 100, lpCount: 15, strategy }) / 10)),
    ),
  }))

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      <Link href="/coverage" className="text-sm text-accent-gold">
        ← Back to coverage overview
      </Link>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            <span className="mr-2">{jurisdiction.flag}</span>
            {jurisdiction.name}
          </h1>
          <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold uppercase text-green-300">
            {metadata?.status ?? 'ACTIVE'}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KeyFact label="Regulator" value={jurisdiction.regulator} />
        <KeyFact label="Formation time" value={`${jurisdiction.setupTimeWeeks.min}-${jurisdiction.setupTimeWeeks.max} weeks`} />
        <KeyFact label="Headline tax" value={metadata?.tax_headline ?? 'See official tax authority guidance.'} />
        <KeyFact label="Min AUM" value={MIN_AUM_BY_JURISDICTION[jurisdiction.id] ?? 'No statutory minimum disclosed'} />
        <KeyFact label="Required providers" value={metadata?.service_providers ?? 'Administrator, auditor, legal counsel'} />
      </section>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-xl font-semibold">Available fund vehicles</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-bg-border text-left text-text-secondary">
                <th className="py-2">Vehicle</th>
                <th className="py-2">Formation cost</th>
                <th className="py-2">Annual cost</th>
                <th className="py-2">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {vehicleRows.map((row) => (
                <tr key={row.vehicle} className="border-b border-bg-border/60">
                  <td className="py-3">{row.vehicle}</td>
                  <td className="py-3">USD {row.formation.toLocaleString()}</td>
                  <td className="py-3">USD {row.annual.toLocaleString()}</td>
                  <td className="py-3">{row.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-bg-border bg-bg-surface p-6">
          <h2 className="text-xl font-semibold">Tax</h2>
          <p className="mt-3 text-sm text-text-secondary">{metadata?.tax_headline ?? jurisdiction.fatcaStatus}</p>
          <p className="mt-4 text-sm font-medium">LP withholding tax rates</p>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            {canonical
              ? Object.entries(canonical.withholding_tax_rates).map(([entity, rate]) => (
                  <li key={entity}>
                    {entity}: {rate}%
                  </li>
                ))
              : null}
          </ul>
          <p className="mt-4 text-sm font-medium">Key treaty network</p>
          <p className="mt-2 text-sm text-text-secondary">{jurisdiction.taxTreaties.join(', ')}</p>
        </article>

        <article className="rounded-xl border border-bg-border bg-bg-surface p-6">
          <h2 className="text-xl font-semibold">Compliance obligations</h2>
          <ul className="mt-3 space-y-3 text-sm text-text-secondary">
            {obligations.length ? (
              obligations.map((obligation) => (
                <li key={obligation.id} className="rounded-lg border border-bg-border p-3">
                  <p className="font-medium text-text-primary">{obligation.title}</p>
                  <p className="mt-1">Deadline: {obligation.typical_deadline}</p>
                </li>
              ))
            ) : (
              <li>No jurisdiction-specific obligations currently in the structured feed.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-xl font-semibold">Suitability matrix (1-10)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suitability.map((item) => (
            <div key={item.label} className="rounded-lg border border-bg-border p-4">
              <p className="text-sm text-text-secondary">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.score}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-bg-border bg-bg-surface p-6">
          <h2 className="text-xl font-semibold">Official links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              Regulator:{' '}
              <a className="text-accent-gold" href={metadata?.official_links.regulator} target="_blank" rel="noreferrer">
                {metadata?.official_links.regulator}
              </a>
            </li>
            <li>
              Registry:{' '}
              <a className="text-accent-gold" href={metadata?.official_links.registry} target="_blank" rel="noreferrer">
                {metadata?.official_links.registry}
              </a>
            </li>
            <li>
              Tax authority:{' '}
              <a className="text-accent-gold" href={metadata?.official_links.tax_authority} target="_blank" rel="noreferrer">
                {metadata?.official_links.tax_authority}
              </a>
            </li>
          </ul>
        </article>

        <article className="rounded-xl border border-bg-border bg-bg-surface p-6">
          <h2 className="text-xl font-semibold">Recent regulatory updates</h2>
          <ul className="mt-3 space-y-3 text-sm text-text-secondary">
            {updates.length ? (
              updates.map((update) => (
                <li key={update.id} className="rounded-lg border border-bg-border p-3">
                  <p className="font-medium text-text-primary">{update.title}</p>
                  <p className="mt-1">{update.summary}</p>
                  <p className="mt-1 text-xs">Published: {update.published_date}</p>
                </li>
              ))
            ) : (
              <li>No active jurisdiction updates currently published.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-xl font-semibold">Verification & citations</h2>
        <p className="mt-2 text-sm text-text-secondary">Last verified: {metadata?.last_verified_date ?? 'N/A'}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-text-secondary">
          {(metadata?.citations ?? []).map((citation) => (
            <li key={citation.url}>
              <a className="text-accent-gold" href={citation.url} target="_blank" rel="noreferrer">
                {citation.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function KeyFact({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-bg-border bg-bg-surface p-4">
      <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
      <p className="mt-2 text-sm text-text-secondary">{value}</p>
    </article>
  )
}
