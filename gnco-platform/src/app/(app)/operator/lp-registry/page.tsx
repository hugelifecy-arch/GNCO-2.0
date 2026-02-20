'use client'

import { useMemo, useState } from 'react'

import { LPRegistryTable } from '@/components/operator/LPRegistryTable'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'
import { MOCK_LPS } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import {
  type ComplianceSeverity,
  evaluateLPCompliance,
  FATCA_CLASSIFICATIONS,
  type FundComplianceProfile,
  type LPComplianceInput,
  LP_ENTITY_TYPES,
} from '@/lib/lp-compliance'
import type { LPEntry } from '@/lib/types'

const severityTone: Record<ComplianceSeverity, string> = {
  green: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  red: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
}

const defaultFundProfile: FundComplianceProfile = {
  fundDomicile: 'Cayman Islands',
  usesLeverage: true,
  hasUSAssets: true,
}

const emptyDraft: LPComplianceInput = {
  legalName: '',
  domicile: 'United States',
  lpType: 'US Pension Fund',
  commitmentAmount: 0,
  hasUSBeneficialOwners: false,
}
export default function LPRegistryPage() {
  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('all')
  const [domicile, setDomicile] = useState('all')
  const [kycStatus, setKycStatus] = useState('all')
  const [commitmentRange, setCommitmentRange] = useState('all')
  const [isAddingLP, setIsAddingLP] = useState(false)
  const [fundProfile, setFundProfile] = useState<FundComplianceProfile>(defaultFundProfile)
  const [lpDraft, setLpDraft] = useState<LPComplianceInput>(emptyDraft)
  const [lpRows, setLpRows] = useState<LPEntry[]>(MOCK_LPS)

  const domiciles = useMemo(() => ['all', ...Array.from(new Set(lpRows.map((lp) => lp.domicile)))], [lpRows])

  const defaultErisaCommitments = useMemo(
    () =>
      lpRows
        .filter((lp) => lp.domicile === 'United States' && lp.entityType === 'pension')
        .reduce((sum, lp) => sum + lp.commitmentAmount, 0),
    [lpRows]
  )

  const totalCommitments = useMemo(
    () => lpRows.reduce((sum, lp) => sum + lp.commitmentAmount, 0) + lpDraft.commitmentAmount,
    [lpDraft.commitmentAmount, lpRows]
  )

  const newLPCompliance = useMemo(
    () =>
      evaluateLPCompliance(lpDraft, {
        ...fundProfile,
        totalFundCommitments: totalCommitments,
        existingERISACommitments: defaultErisaCommitments,
      }),
    [defaultErisaCommitments, fundProfile, lpDraft, totalCommitments]
  )

  const complianceMatrix = useMemo(() => {
    const baselineTotal = lpRows.reduce((sum, lp) => sum + lp.commitmentAmount, 0)
    const baselineErisa = lpRows
      .filter((lp) => lp.domicile === 'United States' && lp.entityType === 'pension')
      .reduce((sum, lp) => sum + lp.commitmentAmount, 0)

    return lpRows.map((lp) => {
      const mappedType = lp.entityType === 'pension' && lp.domicile === 'United States' ? 'US Pension Fund' : 'Institutional Investor'
      const result = evaluateLPCompliance(
        {
          legalName: lp.legalName,
          domicile: lp.domicile,
          lpType: mappedType,
          commitmentAmount: lp.commitmentAmount,
          hasUSBeneficialOwners: false,
        },
        {
          ...fundProfile,
          totalFundCommitments: baselineTotal,
          existingERISACommitments: baselineErisa,
        }
      )
      return {
        lp,
        result,
      }
    })
  }, [fundProfile, lpRows])

  const counselReviewCount = complianceMatrix.filter(({ result }) => result.requiresCounselReview).length

  const exportComplianceMatrix = async () => {
    const payload = {
      generatedAt: new Date().toISOString().slice(0, 10),
      summary: `${counselReviewCount} of ${complianceMatrix.length} LPs require counsel review before subscription`,
      rows: complianceMatrix.map(({ lp, result }) => ({
        lpName: lp.legalName,
        domicile: lp.domicile,
        status: result.status,
        taxClassification: result.taxForms.join(', '),
        findings: result.findings,
      })),
    }

    const response = await fetch('/api/export/lp-compliance-matrix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) return

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lp-compliance-matrix-${payload.generatedAt}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const addDraftLP = () => {
    if (!lpDraft.legalName || lpDraft.commitmentAmount <= 0) return

    const entry: LPEntry = {
      id: `LP${(lpRows.length + 1).toString().padStart(3, '0')}`,
      legalName: lpDraft.legalName,
      domicile: lpDraft.domicile,
      commitmentAmount: lpDraft.commitmentAmount,
      calledCapital: 0,
      distributionsReceived: 0,
      entityType: lpDraft.domicile === 'United States' && lpDraft.lpType.includes('Pension') ? 'pension' : 'foundation',
      kycStatus: 'pending',
      subscriptionStatus: 'draft',
      relationshipManager: 'Compliance Desk',
      onboardedDate: new Date().toISOString().slice(0, 10),
    }

    setLpRows((prev) => [entry, ...prev])
    setIsAddingLP(false)
    setLpDraft(emptyDraft)
  }

  return (
    <main className="space-y-5 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl">LP Registry</h1>
          <span className="rounded-full border border-bg-border bg-bg-surface px-3 py-1 text-sm text-text-secondary">
            {lpRows.length} Limited Partners
          </span>
        </div>
        <div className="flex gap-2">
          <ComingSoonButton>Export CSV (coming soon)</ComingSoonButton>
          <button
            className="rounded border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold"
            onClick={() => setIsAddingLP((prev) => !prev)}
          >
            + Add LP
          </button>
        </div>
      </header>

      {isAddingLP ? (
        <section className="grid gap-4 rounded-lg border border-bg-border bg-bg-surface p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-serif text-xl">New LP intake</h2>
            <input
              value={lpDraft.legalName}
              onChange={(event) => setLpDraft((prev) => ({ ...prev, legalName: event.target.value }))}
              placeholder="LP legal name"
              className="w-full rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
            />
            <div className="grid gap-3 lg:grid-cols-2">
              <select
                value={lpDraft.domicile}
                onChange={(event) => setLpDraft((prev) => ({ ...prev, domicile: event.target.value }))}
                className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
              >
                <option>United States</option>
                <option>Germany</option>
                <option>France</option>
                <option>Netherlands</option>
                <option>United Kingdom</option>
                <option>Cayman Islands</option>
                <option>Japan</option>
                <option>Singapore</option>
              </select>
              <select
                value={lpDraft.lpType}
                onChange={(event) => setLpDraft((prev) => ({ ...prev, lpType: event.target.value as LPComplianceInput['lpType'] }))}
                className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
              >
                {LP_ENTITY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              min={0}
              value={lpDraft.commitmentAmount}
              onChange={(event) => setLpDraft((prev) => ({ ...prev, commitmentAmount: Number(event.target.value) || 0 }))}
              placeholder="Commitment amount (USD)"
              className="w-full rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={lpDraft.hasUSBeneficialOwners}
                onChange={(event) =>
                  setLpDraft((prev) => ({ ...prev, hasUSBeneficialOwners: event.target.checked }))
                }
              />
              Non-US LP has US beneficial owners
            </label>
            <button onClick={addDraftLP} className="rounded bg-accent-gold px-4 py-2 text-sm text-black">Save LP + Run screens</button>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg">Automated LP compliance screens</h3>
            <p className="text-sm text-text-secondary">Runs as soon as domicile and LP type are selected.</p>
            <div className="grid gap-2 text-xs text-text-secondary lg:grid-cols-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={fundProfile.usesLeverage} onChange={(event) => setFundProfile((prev) => ({ ...prev, usesLeverage: event.target.checked }))} />
                Fund uses leverage
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={fundProfile.hasUSAssets} onChange={(event) => setFundProfile((prev) => ({ ...prev, hasUSAssets: event.target.checked }))} />
                Fund has US real estate / operating assets
              </label>
            </div>
            <label className="block text-xs text-text-secondary">
              Fund domicile
              <select className="mt-1 w-full rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm" value={fundProfile.fundDomicile} onChange={(event) => setFundProfile((prev) => ({ ...prev, fundDomicile: event.target.value }))}>
                <option>Cayman Islands</option>
                <option>BVI</option>
                <option>Jersey</option>
                <option>Ireland</option>
                <option>Luxembourg</option>
              </select>
            </label>

            <div className={`rounded border p-3 text-xs ${severityTone[newLPCompliance.status]}`}>
              <p className="font-semibold uppercase">{newLPCompliance.status} status</p>
              <p className="mt-1">ERISA exposure: {newLPCompliance.erisaPlanPercentage.toFixed(1)}% of total commitments ({formatCurrency(totalCommitments)} fund commitments).</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {newLPCompliance.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
              <p className="mt-2">Required forms: {newLPCompliance.taxForms.join(', ') || FATCA_CLASSIFICATIONS.US_LP}</p>
              {newLPCompliance.npprCountries.length > 0 ? (
                <p className="mt-2">NPPR required before subscription in: {newLPCompliance.npprCountries.join(', ')}</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 rounded-lg border border-bg-border bg-bg-surface p-4 lg:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or organization"
          className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm outline-none"
        />
        <select value={entityType} onChange={(event) => setEntityType(event.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm">
          <option value="all">Entity Type</option>
          <option value="family-office">Family Office</option>
          <option value="foundation">Foundation</option>
          <option value="pension">Pension</option>
          <option value="sovereign">Sovereign</option>
          <option value="trust">Trust</option>
          <option value="fund-of-funds">Fund of Funds</option>
          <option value="endowment">Endowment</option>
        </select>
        <select value={domicile} onChange={(event) => setDomicile(event.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm">
          <option value="all">Domicile</option>
          {domiciles.filter((d) => d !== 'all').map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <select value={kycStatus} onChange={(event) => setKycStatus(event.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm">
          <option value="all">KYC Status</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select value={commitmentRange} onChange={(event) => setCommitmentRange(event.target.value)} className="rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm">
          <option value="all">Commitment Range</option>
          <option value="under-25m">Under $25M</option>
          <option value="25m-75m">$25M-$75M</option>
          <option value="75m-plus">$75M+</option>
        </select>
      </section>

      <LPRegistryTable
        data={lpRows}
        search={search}
        filters={{ entityType, domicile, kycStatus, commitmentRange }}
      />

      <section className="rounded-lg border border-bg-border bg-bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl">LP compliance matrix</h2>
          <button onClick={exportComplianceMatrix} className="rounded border border-bg-border px-3 py-1 text-sm">Export PDF for counsel</button>
        </div>
        <p className="mb-4 text-sm text-text-secondary">
          {counselReviewCount} of {complianceMatrix.length} LPs require counsel review before subscription.
        </p>
        <div className="space-y-2">
          {complianceMatrix.map(({ lp, result }) => (
            <article key={lp.id} className="flex flex-wrap items-start justify-between gap-2 rounded border border-bg-border p-3 text-sm">
              <div>
                <p className="font-medium">{lp.legalName}</p>
                <p className="text-xs text-text-secondary">{lp.domicile} • {result.taxForms.join(', ')}</p>
                {result.findings.length > 0 ? <p className="text-xs text-text-secondary">{result.findings[0]}</p> : null}
              </div>
              <span className={`rounded border px-2 py-1 text-xs font-medium uppercase ${severityTone[result.status]}`}>
                {result.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
