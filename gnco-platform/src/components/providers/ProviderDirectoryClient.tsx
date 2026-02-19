'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { FundSize, ServiceProvider, ServiceProviderType } from '@/lib/types'

const fundSizeLabels: Record<FundSize, string> = {
  'under-50m': 'Under $50M',
  '50m-250m': '$50M–250M',
  '250m-1b': '$250M–1B',
  '1b-plus': '$1B+',
}

const serviceTypes: ServiceProviderType[] = [
  'Administrator',
  'Auditor',
  'Custodian',
  'Legal Counsel',
  'Company Secretary',
  'Registered Office',
  'Banking',
]

interface ProviderDirectoryClientProps {
  providers: ServiceProvider[]
  jurisdictions: { id: string; name: string }[]
}

export function ProviderDirectoryClient({ providers, jurisdictions }: ProviderDirectoryClientProps) {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all')
  const [selectedType, setSelectedType] = useState<'all' | ServiceProviderType>('all')
  const [selectedFundSize, setSelectedFundSize] = useState<'all' | FundSize>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filteredProviders = useMemo(
    () =>
      providers
        .filter((provider) => (selectedJurisdiction === 'all' ? true : provider.jurisdictions.includes(selectedJurisdiction)))
        .filter((provider) => (selectedType === 'all' ? true : provider.type === selectedType))
        .filter((provider) => (selectedFundSize === 'all' ? true : provider.fund_sizes.includes(selectedFundSize)))
        .filter((provider) => (verifiedOnly ? provider.gnco_verified : true))
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    [providers, selectedFundSize, selectedJurisdiction, selectedType, verifiedOnly],
  )

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-bg-border bg-bg-surface p-6">
        <h2 className="text-lg font-semibold">Directory filters</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <FilterSelect label="Jurisdiction" value={selectedJurisdiction} onChange={setSelectedJurisdiction} options={[{ value: 'all', label: 'All jurisdictions' }, ...jurisdictions.map((item) => ({ value: item.id, label: item.name }))]} />
          <FilterSelect label="Service type" value={selectedType} onChange={(value) => setSelectedType(value as 'all' | ServiceProviderType)} options={[{ value: 'all', label: 'All service types' }, ...serviceTypes.map((item) => ({ value: item, label: item }))]} />
          <FilterSelect label="Fund size" value={selectedFundSize} onChange={(value) => setSelectedFundSize(value as 'all' | FundSize)} options={[{ value: 'all', label: 'All fund sizes' }, ...Object.entries(fundSizeLabels).map(([value, label]) => ({ value, label }))]} />
          <label className="flex items-center gap-2 text-sm text-text-secondary md:pt-7">
            <input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} />
            GNCO verified only
          </label>
        </div>
      </section>

      <section className="space-y-4">
        {filteredProviders.map((provider) => (
          <article key={provider.id} className="rounded-xl border border-bg-border bg-bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-text-secondary">{provider.type}</p>
                <h3 className="text-xl font-semibold">{provider.name}</h3>
                <p className="mt-2 text-sm text-text-secondary">{provider.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {provider.featured ? <span className="rounded-full bg-accent-gold/20 px-2 py-1 text-accent-gold">Featured</span> : null}
                {provider.gnco_verified ? <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-400">GNCO Verified</span> : null}
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-text-secondary md:grid-cols-2">
              <p>Fee range: {provider.fee_range}</p>
              <p>Response time: {provider.response_time}</p>
            </div>
            <Link href={`/providers/${provider.id}`} className="mt-4 inline-block text-sm text-accent-gold">
              View profile →
            </Link>
          </article>
        ))}
        {filteredProviders.length === 0 ? <p className="text-sm text-text-secondary">No providers match your current filters.</p> : null}
      </section>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="space-y-1 text-sm text-text-secondary">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-bg-border bg-bg-canvas px-3 py-2 text-text-primary">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}
