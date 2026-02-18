'use client'

import { useMemo, useState } from 'react'

import { DemoDataToggle } from '@/components/DemoDataToggle'
import { DemoDatasetBadge } from '@/components/DemoDatasetBadge'
import { LPRegistryTable } from '@/components/operator/LPRegistryTable'
import { useDemoMode } from '@/hooks/useDemoMode'
import { MOCK_LPS } from '@/lib/mock-data'

export default function LPRegistryPage() {
  const { mode, setMode } = useDemoMode()
  const data = useMemo(() => (mode === 'sample' ? MOCK_LPS : []), [mode])

  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('all')
  const [domicile, setDomicile] = useState('all')
  const [kycStatus, setKycStatus] = useState('all')
  const [commitmentRange, setCommitmentRange] = useState('all')

  const domiciles = useMemo(
    () => ['all', ...Array.from(new Set(data.map((lp) => lp.domicile)))],
    [data]
  )

  return (
    <main className="space-y-5 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl">LP Registry</h1>
          <DemoDatasetBadge />
          <span className="rounded-full border border-bg-border bg-bg-surface px-3 py-1 text-sm text-text-secondary">
            {data.length} Limited Partners
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DemoDataToggle mode={mode} onChange={setMode} />
          <button className="rounded border border-bg-border px-4 py-2 text-sm">
            Export CSV (Demo)
          </button>
          <button className="rounded border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold">
            + Add LP (Demo)
          </button>
        </div>
      </header>

      <section className="grid gap-3 rounded-lg border border-bg-border bg-bg-surface p-4 lg:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or organization"
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm outline-none"
        />
        <select
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
        >
          <option value="all">Entity Type</option>
          <option value="family-office">Family Office</option>
          <option value="foundation">Foundation</option>
          <option value="pension">Pension</option>
          <option value="sovereign">Sovereign</option>
          <option value="trust">Trust</option>
          <option value="fund-of-funds">Fund of Funds</option>
          <option value="endowment">Endowment</option>
        </select>
        <select
          value={domicile}
          onChange={(event) => setDomicile(event.target.value)}
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
        >
          <option value="all">Domicile</option>
          {domiciles
            .filter((country) => country !== 'all')
            .map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
        </select>
        <select
          value={kycStatus}
          onChange={(event) => setKycStatus(event.target.value)}
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
        >
          <option value="all">KYC Status</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select
          value={commitmentRange}
          onChange={(event) => setCommitmentRange(event.target.value)}
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
        >
          <option value="all">Commitment Range</option>
          <option value="under-25m">Under $25M</option>
          <option value="25m-75m">$25M-$75M</option>
          <option value="75m-plus">$75M+</option>
        </select>
      </section>

      <LPRegistryTable
        data={data}
        search={search}
        filters={{ entityType, domicile, kycStatus, commitmentRange }}
      />
    </main>
  )
}
