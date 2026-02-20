'use client'

import { useMemo, useState } from 'react'

import { JURISDICTIONS_CANONICAL } from '@/data/jurisdictions'

type LPEntityType =
  | 'Taxable Individual'
  | 'Pension Fund'
  | 'Endowment/Foundation'
  | 'Sovereign Wealth Fund'
  | 'Insurance Co'
  | 'Corporate'

type LPRow = {
  id: string
  label: string
  domicile: string
  entityType: LPEntityType
  commitment: number
}

type JurisdictionWithRates = (typeof JURISDICTIONS_CANONICAL)[number] & {
  withholding_tax_rates?: Partial<Record<LPEntityType, number>>
  treaty_reduction?: number
}

const DISCLAIMER =
  'Tax modeling is illustrative only. Treaty positions depend on LP-specific facts. Verify with qualified tax counsel.'

const ENTITY_TYPES: LPEntityType[] = [
  'Taxable Individual',
  'Pension Fund',
  'Endowment/Foundation',
  'Sovereign Wealth Fund',
  'Insurance Co',
  'Corporate',
]

const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'United Kingdom',
  'Ireland',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Luxembourg',
  'Portugal',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Austria',
  'Poland',
  'Czech Republic',
  'Greece',
  'Turkey',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'South Africa',
  'Nigeria',
  'Mauritius',
  'India',
  'China',
  'Hong Kong',
  'Singapore',
  'Japan',
  'South Korea',
  'Australia',
  'New Zealand',
  'Indonesia',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Taiwan',
]

const makeDefaultLP = (id: number): LPRow => ({
  id: `lp-${id}`,
  label: `LP ${id}`,
  domicile: 'United States',
  entityType: 'Taxable Individual',
  commitment: 10000000,
})

function percentileColor(value: number, min: number, max: number) {
  if (max === min) {
    return 'bg-yellow-100 text-yellow-900'
  }
  const score = (value - min) / (max - min)
  if (score > 0.66) return 'bg-green-100 text-green-900'
  if (score > 0.33) return 'bg-yellow-100 text-yellow-900'
  return 'bg-red-100 text-red-900'
}

function formatPct(value: number) {
  return `${value.toFixed(2)}%`
}

export function LPTaxModeler() {
  const [grossIrr, setGrossIrr] = useState(15)
  const [lps, setLps] = useState<LPRow[]>([makeDefaultLP(1), makeDefaultLP(2)])

  const jurisdictions = useMemo(() => JURISDICTIONS_CANONICAL.slice(0, 15) as JurisdictionWithRates[], [])

  const results = useMemo(() => {
    return jurisdictions.map((jurisdiction) => {
      const lpResults = lps.map((lp) => {
        const hasTreaty = jurisdiction.taxTreaties.includes(lp.domicile)
        const baseWht = jurisdiction.withholding_tax_rates?.[lp.entityType] ?? 15
        const treatyAdjustedWht = hasTreaty
          ? Math.max(baseWht - (jurisdiction.treaty_reduction ?? 5), 0)
          : baseWht
        const ubtiRisk =
          lp.domicile === 'United States' &&
          (lp.entityType === 'Pension Fund' || lp.entityType === 'Endowment/Foundation')
        const eciRisk =
          jurisdiction.id === 'delaware' && lp.domicile !== 'United States' && lp.entityType !== 'Corporate'
        const riskDrag = (ubtiRisk ? 1.5 : 0) + (eciRisk ? 1.25 : 0)
        const netIrr = grossIrr * (1 - treatyAdjustedWht / 100) - riskDrag

        return {
          ...lp,
          whtRate: treatyAdjustedWht,
          treatyAvailable: hasTreaty,
          treatyName: hasTreaty ? `${jurisdiction.name}–${lp.domicile} Income Tax Treaty` : 'N/A',
          ubtiRisk,
          eciRisk,
          afterTaxIrr: Math.max(netIrr, 0),
        }
      })

      const average = lpResults.reduce((sum, lpResult) => sum + lpResult.afterTaxIrr, 0) / lpResults.length
      return {
        jurisdiction,
        lpResults,
        average,
      }
    })
  }, [grossIrr, jurisdictions, lps])

  const optimalJurisdiction = useMemo(() => {
    return results.reduce((best, current) => (current.average > best.average ? current : best), results[0])
  }, [results])

  const minIrr = Math.min(...results.flatMap((result) => result.lpResults.map((lpResult) => lpResult.afterTaxIrr)))
  const maxIrr = Math.max(...results.flatMap((result) => result.lpResults.map((lpResult) => lpResult.afterTaxIrr)))

  const updateLp = (id: string, updates: Partial<LPRow>) => {
    setLps((current) => current.map((lp) => (lp.id === id ? { ...lp, ...updates } : lp)))
  }

  const addLp = () => {
    if (lps.length >= 20) return
    setLps((current) => [...current, makeDefaultLP(current.length + 1)])
  }

  const downloadCsv = () => {
    const header = ['Jurisdiction', ...lps.map((lp) => lp.label)]
    const rows = results.map((result) => [
      result.jurisdiction.name,
      ...result.lpResults.map((lpResult) => lpResult.afterTaxIrr.toFixed(2)),
    ])
    const metaRows = [
      [],
      ['Disclaimer', DISCLAIMER],
      ['Gross IRR assumption', `${grossIrr.toFixed(2)}%`],
    ]
    const csv = [header, ...rows, ...metaRows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lp-tax-impact-model.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) return
    const header = `<tr><th>Jurisdiction</th>${lps.map((lp) => `<th>${lp.label}</th>`).join('')}</tr>`
    const body = results
      .map(
        (result) =>
          `<tr><td>${result.jurisdiction.name}</td>${result.lpResults
            .map((lpResult) => `<td>${formatPct(lpResult.afterTaxIrr)}</td>`)
            .join('')}</tr>`,
      )
      .join('')
    printWindow.document.write(`<html><body><h2>LP Tax Impact Modeler</h2><p>Gross IRR assumption: ${grossIrr.toFixed(2)}%</p><p><strong>${DISCLAIMER}</strong></p><table border="1" cellspacing="0" cellpadding="6"><thead>${header}</thead><tbody>${body}</tbody></table><script>window.print();</script></body></html>`)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6 rounded-md border border-bg-border bg-bg-elevated p-4">
      <div>
        <h2 className="text-2xl font-semibold">LP Tax Impact Modeler</h2>
        <p className="text-sm text-text-secondary">Model jurisdiction-level after-tax IRR outcomes across LP profiles and treaty assumptions.</p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Input Panel</h3>
          <button className="rounded bg-brand-primary px-3 py-1 text-sm text-white disabled:opacity-50" onClick={addLp} disabled={lps.length >= 20}>
            Add LP ({lps.length}/20)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border text-left">
                <th className="p-2">Name/Label</th>
                <th className="p-2">Domicile</th>
                <th className="p-2">Entity type</th>
                <th className="p-2">Commitment (€)</th>
              </tr>
            </thead>
            <tbody>
              {lps.map((lp) => (
                <tr key={lp.id} className="border-b border-bg-border/70">
                  <td className="p-2">
                    <input className="w-full rounded border border-bg-border bg-transparent p-2" value={lp.label} onChange={(event) => updateLp(lp.id, { label: event.target.value })} />
                  </td>
                  <td className="p-2">
                    <select className="w-full rounded border border-bg-border bg-transparent p-2" value={lp.domicile} onChange={(event) => updateLp(lp.id, { domicile: event.target.value })}>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      className="w-full rounded border border-bg-border bg-transparent p-2"
                      value={lp.entityType}
                      onChange={(event) => updateLp(lp.id, { entityType: event.target.value as LPEntityType })}
                    >
                      {ENTITY_TYPES.map((entityType) => (
                        <option key={entityType} value={entityType}>
                          {entityType}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full rounded border border-bg-border bg-transparent p-2"
                      type="number"
                      min={0}
                      step={100000}
                      value={lp.commitment}
                      onChange={(event) => updateLp(lp.id, { commitment: Number(event.target.value) })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <label className="block text-sm">
          Gross IRR assumption (%)
          <input
            className="mt-1 w-full rounded border border-bg-border bg-transparent p-2"
            type="number"
            value={grossIrr}
            min={0}
            step={0.5}
            onChange={(event) => setGrossIrr(Number(event.target.value))}
          />
        </label>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Output: Effective After-tax IRR Matrix</h3>
          <div className="flex gap-2">
            <button className="rounded border border-bg-border px-3 py-1 text-sm" onClick={downloadCsv}>
              Download CSV
            </button>
            <button className="rounded border border-bg-border px-3 py-1 text-sm" onClick={downloadPdf}>
              Download PDF
            </button>
          </div>
        </div>
        <p className="rounded border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">{DISCLAIMER}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-bg-border p-2 text-left">Jurisdiction</th>
                {lps.map((lp) => (
                  <th key={lp.id} className="border border-bg-border p-2 text-left">
                    {lp.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.jurisdiction.id}>
                  <td className="border border-bg-border p-2 font-medium">
                    <div className="flex items-center gap-2">
                      <span>{result.jurisdiction.name}</span>
                      {optimalJurisdiction?.jurisdiction.id === result.jurisdiction.id ? (
                        <span className="rounded bg-green-600 px-2 py-0.5 text-xs text-white">Optimal for most LPs</span>
                      ) : null}
                    </div>
                  </td>
                  {result.lpResults.map((lpResult) => (
                    <td key={`${result.jurisdiction.id}-${lpResult.id}`} className={`border border-bg-border p-2 ${percentileColor(lpResult.afterTaxIrr, minIrr, maxIrr)}`}>
                      <div className="font-semibold">{formatPct(lpResult.afterTaxIrr)}</div>
                      <div className="text-xs">WHT: {formatPct(lpResult.whtRate)}</div>
                      <div className="text-xs">Treaty: {lpResult.treatyAvailable ? `YES (${lpResult.treatyName})` : 'NO'}</div>
                      <div className="text-xs">UBTI: {lpResult.ubtiRisk ? 'FLAG' : 'OK'} | ECI: {lpResult.eciRisk ? 'FLAG' : 'OK'}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
