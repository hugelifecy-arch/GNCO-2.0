'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import type { JurisdictionProfile } from '@/lib/types'

type RegionFilter = 'all' | JurisdictionProfile['region']
type TreatyFilter = 'all' | JurisdictionProfile['taxTreatyStrength']
type StatusFilter = 'all' | JurisdictionProfile['coverageStatus']

const REGION_OPTIONS: { label: string; value: RegionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Americas', value: 'americas' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia-Pacific', value: 'asia-pacific' },
  { label: 'Middle East', value: 'middle-east' },
]

const TREATY_OPTIONS: { label: string; value: TreatyFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Limited', value: 'limited' },
]

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Full Coverage', value: 'full' },
  { label: 'Partial', value: 'partial' },
  { label: 'Coming Soon', value: 'coming-soon' },
]

const formatRange = (min: number, max: number) => `$${Math.round(min / 1000)}K–$${Math.round(max / 1000)}K`

const getCoverageLabel = (status: JurisdictionProfile['coverageStatus']) => {
  if (status === 'full') return 'Full'
  if (status === 'partial') return 'Partial'
  return 'Coming Soon'
}

const getTreatyBarBlocks = (strength: JurisdictionProfile['taxTreatyStrength']) => {
  if (strength === 'high') return 8
  if (strength === 'medium') return 5
  return 3
}

export function CoveragePageClient() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<RegionFilter>('all')
  const [treatyStrength, setTreatyStrength] = useState<TreatyFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionProfile | null>(null)

  const filteredJurisdictions = useMemo(() => {
    return JURISDICTIONS.filter((jurisdiction) => {
      const queryMatch = jurisdiction.name.toLowerCase().includes(query.trim().toLowerCase())
      const regionMatch = region === 'all' || jurisdiction.region === region
      const treatyMatch = treatyStrength === 'all' || jurisdiction.taxTreatyStrength === treatyStrength
      const statusMatch = status === 'all' || jurisdiction.coverageStatus === status

      return queryMatch && regionMatch && treatyMatch && statusMatch
    })
  }, [query, region, treatyStrength, status])

  return (
    <main className="bg-bg-primary px-4 py-12 text-text-primary sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">15 Jurisdictions. One Platform.</h1>
          <p className="max-w-4xl text-base text-text-secondary sm:text-lg">
            GNCO covers the world&apos;s primary fund domiciles with deep operational intelligence — real costs, real
            timelines, real service provider data.
          </p>
        </section>

        <section className="grid gap-4 rounded-xl border border-bg-border bg-bg-surface p-4 text-center sm:grid-cols-3">
          <StatCell value="15" label="Jurisdictions" />
          <StatCell value="47" label="Vehicle Types" />
          <StatCell value="200+" label="Tax Treaties Mapped" />
        </section>

        <section className="space-y-4 rounded-xl border border-bg-border bg-bg-surface p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm text-text-secondary md:col-span-2 xl:col-span-1">
              <span>Search by jurisdiction name</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g., Cayman, Singapore"
                className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none ring-accent-gold/40 transition focus:ring-2"
              />
            </label>

            <FilterSelect label="Region" value={region} onChange={setRegion} options={REGION_OPTIONS} />
            <FilterSelect
              label="Tax Treaty Strength"
              value={treatyStrength}
              onChange={setTreatyStrength}
              options={TREATY_OPTIONS}
            />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJurisdictions.map((jurisdiction) => {
            const filledBlocks = getTreatyBarBlocks(jurisdiction.taxTreatyStrength)

            return (
              <article
                key={jurisdiction.id}
                className="flex h-full flex-col rounded-xl border border-bg-border bg-bg-elevated p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl">{jurisdiction.flag}</p>
                    <h2 className="text-lg font-semibold uppercase tracking-wide">{jurisdiction.name}</h2>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/40 bg-accent-green/10 px-2.5 py-1 text-xs text-accent-green">
                    {getCoverageLabel(jurisdiction.coverageStatus)}
                    {jurisdiction.coverageStatus === 'full' && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                </div>

                <p className="mb-4 text-sm text-text-secondary">{jurisdiction.primaryVehicles.slice(0, 3).join(' · ')}</p>

                <div className="mb-2 flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">Tax Treaties:</span>
                  <span className="font-mono text-xs tracking-[1.8px] text-accent-gold">
                    {'█'.repeat(filledBlocks)}{'░'.repeat(10 - filledBlocks)}
                  </span>
                  <span className="capitalize text-text-primary">{jurisdiction.taxTreatyStrength}</span>
                </div>

                <p className="text-sm text-text-secondary">
                  Formation: {formatRange(jurisdiction.formationCostRange.min, jurisdiction.formationCostRange.max)}{' '}
                  <span className="text-text-primary">
                    {jurisdiction.setupTimeWeeks.min}–{jurisdiction.setupTimeWeeks.max} wks
                  </span>
                </p>
                <p className="mb-4 text-sm text-text-secondary">Regulator: {jurisdiction.regulator}</p>

                <p className="mb-4 text-sm text-text-secondary">
                  <span className="text-text-primary">Best for:</span> {jurisdiction.bestFor[0]}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedJurisdiction(jurisdiction)}
                  className="mt-auto self-end text-sm font-medium text-accent-gold transition hover:text-accent-gold-light"
                >
                  Details →
                </button>
              </article>
            )
          })}

          {!filteredJurisdictions.length && (
            <div className="rounded-xl border border-bg-border bg-bg-elevated p-6 text-sm text-text-secondary md:col-span-2 xl:col-span-3">
              No jurisdictions match your filters. Try broadening your search.
            </div>
          )}
        </section>
      </div>

      <JurisdictionDrawer profile={selectedJurisdiction} onClose={() => setSelectedJurisdiction(null)} />
    </main>
  )
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-elevated p-4">
      <p className="text-2xl font-semibold text-accent-gold">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  )
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { label: string; value: T }[]
}) {
  return (
    <label className="space-y-2 text-sm text-text-secondary">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-md border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none ring-accent-gold/40 transition focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function JurisdictionDrawer({
  profile,
  onClose,
}: {
  profile: JurisdictionProfile | null
  onClose: () => void
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${profile ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-bg-border bg-bg-surface p-6 transition-transform duration-300 ease-out sm:p-8 ${profile ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!profile}
      >
        {profile && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl">{profile.flag}</p>
                <h3 className="text-2xl font-semibold">{profile.name}</h3>
                <p className="mt-1 text-sm capitalize text-text-secondary">Coverage: {getCoverageLabel(profile.coverageStatus)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-bg-border p-2 text-text-secondary hover:text-text-primary"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <DetailBlock title="Primary Vehicles" items={profile.primaryVehicles} />
            <DetailLine label="Regulator" value={profile.regulator} />
            <DetailLine
              label="Formation Cost"
              value={formatRange(profile.formationCostRange.min, profile.formationCostRange.max)}
            />
            <DetailLine
              label="Annual Cost"
              value={formatRange(profile.annualCostRange.min, profile.annualCostRange.max)}
            />
            <DetailLine
              label="Formation Timeline"
              value={`${profile.setupTimeWeeks.min}–${profile.setupTimeWeeks.max} weeks`}
            />
            <DetailLine label="Tax Treaty Strength" value={profile.taxTreatyStrength} />
            <DetailBlock title="Best For" items={profile.bestFor} />
            <DetailBlock title="Not Ideal For" items={profile.notIdealFor} />

            <section className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Service Providers</h4>
              <DetailBlock title="Administrators" items={profile.keyServiceProviders.administrators} nested />
              <DetailBlock title="Law Firms" items={profile.keyServiceProviders.lawFirms} nested />
              <DetailBlock title="Auditors" items={profile.keyServiceProviders.auditors} nested />
            </section>

            <DetailBlock title="Tax Treaty Partners" items={profile.taxTreaties} />
            <DetailLine label="FATCA Status" value={profile.fatcaStatus} />

            <section>
              <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-secondary">Notes</h4>
              <p className="text-sm text-text-secondary">{profile.notes}</p>
            </section>
          </div>
        )}
      </aside>
    </>
  )
}

function DetailBlock({
  title,
  items,
  nested = false,
}: {
  title: string
  items: string[]
  nested?: boolean
}) {
  return (
    <section>
      <h4 className={`mb-1 text-sm font-semibold ${nested ? 'text-text-primary' : 'uppercase tracking-wide text-text-secondary'}`}>
        {title}
      </h4>
      <ul className="list-disc space-y-1 pl-5 text-sm text-text-secondary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-text-secondary">
      <span className="font-medium text-text-primary">{label}:</span> {value}
    </p>
  )
}
