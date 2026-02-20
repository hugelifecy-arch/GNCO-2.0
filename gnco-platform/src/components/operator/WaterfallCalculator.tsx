'use client'

import { useState } from 'react'

import { calculateWaterfall } from '@/lib/waterfall-calculator'
import { MOCK_FUNDS, MOCK_LPS } from '@/lib/mock-data'
import type { WaterfallOutput } from '@/lib/types'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'
import { usePrivacyMode } from '@/components/shared/PrivacyModeContext'

export function WaterfallCalculator() {
  const { formatPrivate } = usePrivacyMode()
  const [fund, setFund] = useState(MOCK_FUNDS[0]?.fundName ?? '')
  const [proceeds, setProceeds] = useState(160000000)
  const [hurdle, setHurdle] = useState(8)
  const [carry, setCarry] = useState(20)
  const [catchUpEnabled, setCatchUpEnabled] = useState(true)
  const [catchUpPercent, setCatchUpPercent] = useState(100)
  const [result, setResult] = useState<WaterfallOutput | null>(null)

  const onCalculate = () => {
    setResult(
      calculateWaterfall({
        totalProceeds: proceeds,
        preferredReturn: hurdle,
        carriedInterest: carry,
        catchUpPercent: catchUpEnabled ? catchUpPercent : 0,
        managementFeeOffset: false,
        lpCommitments: MOCK_LPS.map((lp) => ({
          lpId: lp.id,
          lpName: lp.legalName,
          commitment: lp.commitmentAmount,
        })),
      })
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-bg-border bg-bg-surface p-6">
        <h2 className="mb-4 font-serif text-xl">Inputs</h2>
        <div className="grid gap-3">
          <select className="rounded border border-bg-border bg-bg-elevated px-3 py-2" value={fund} onChange={(e) => setFund(e.target.value)}>
            {MOCK_FUNDS.map((f) => <option key={f.fundName}>{formatPrivate(f.fundName, 'name', 'fund')}</option>)}
          </select>
          <input type="number" value={proceeds} onChange={(e) => setProceeds(Number(e.target.value))} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" placeholder="Total Distributable Proceeds" />
          <input type="number" value={hurdle} onChange={(e) => setHurdle(Number(e.target.value))} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" placeholder="Preferred Return / Hurdle" />
          <input type="number" value={carry} onChange={(e) => setCarry(Number(e.target.value))} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" placeholder="Carried Interest" />
          <div className="flex items-center gap-4 rounded border border-bg-border bg-bg-elevated px-3 py-2 text-sm">
            GP Catch-Up Provision:
            <label><input type="radio" checked={catchUpEnabled} onChange={() => setCatchUpEnabled(true)} /> Yes</label>
            <label><input type="radio" checked={!catchUpEnabled} onChange={() => setCatchUpEnabled(false)} /> No</label>
          </div>
          {catchUpEnabled ? (
            <input type="number" value={catchUpPercent} onChange={(e) => setCatchUpPercent(Number(e.target.value))} className="rounded border border-bg-border bg-bg-elevated px-3 py-2" placeholder="Catch-Up %" />
          ) : null}
          <button type="button" onClick={onCalculate} className="rounded border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold">
            Calculate Waterfall
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-bg-border bg-bg-surface p-6">
        <h2 className="mb-4 font-serif text-xl">Results</h2>
        {result ? (
          <div className="space-y-5">
            <div className="space-y-2">
              {result.tiers.map((tier) => (
                <div key={tier.tierName} className="flex items-center justify-between rounded border border-bg-border px-3 py-2 text-sm">
                  <span>{tier.tierName}</span>
                  <span className="text-accent-gold">{formatPrivate(tier.totalAmount, 'currency')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-text-secondary">Tier Proportions</p>
              <div className="flex h-5 overflow-hidden rounded">
                {result.tiers.map((tier, idx) => (
                  <div
                    key={tier.tierName}
                    style={{ width: `${(tier.totalAmount / result.totalDistributed) * 100}%` }}
                    className={['bg-accent-gold', 'bg-accent-blue', 'bg-accent-green', 'bg-accent-amber'][idx % 4]}
                    title={tier.tierName}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-bg-border text-text-secondary">
                  <tr><th className="px-2 py-2">LP Name</th><th className="px-2 py-2">Commitment</th><th className="px-2 py-2">Distribution Amount</th><th className="px-2 py-2">Effective Return</th></tr>
                </thead>
                <tbody>
                  {result.lpDistributions.map((lp) => {
                    const commitment = MOCK_LPS.find((entry) => entry.id === lp.lpId)?.commitmentAmount ?? 0
                    return (
                      <tr key={lp.lpId} className="border-b border-bg-border/30">
                        <td className="px-2 py-2">{formatPrivate(lp.lpName, 'name', 'lp')}</td>
                        <td className="px-2 py-2">{formatPrivate(commitment, 'currency')}</td>
                        <td className="px-2 py-2">{formatPrivate(lp.amount, 'currency')}</td>
                        <td className="px-2 py-2">{lp.effectiveReturn.toFixed(2)}%</td>
                      </tr>
                    )
                  })}
                  <tr className="font-medium">
                    <td className="px-2 py-2">Total</td>
                    <td className="px-2 py-2">-</td>
                    <td className="px-2 py-2">{formatPrivate(result.totalDistributed - result.gpCarry, 'currency')}</td>
                    <td className="px-2 py-2">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm">GP Carry: <span className="text-accent-gold">{formatPrivate(result.gpCarry, 'currency')}</span></p>
            <div className="flex flex-wrap gap-2">
              <ComingSoonButton>Export as Excel (coming soon)</ComingSoonButton>
              <ComingSoonButton>Generate Notices (coming soon)</ComingSoonButton>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Run calculation to view results.</p>
        )}
      </div>
    </section>
  )
}
