'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { trackEvent } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'

type FundStrategy = 'private-equity' | 'real-estate' | 'venture-capital' | 'private-credit'

const PREVIEW_JURISDICTIONS = ['ireland', 'bvi', 'jersey'] as const

const BASE_SCORES: Record<string, number> = {
  ireland: 87,
  bvi: 71,
  jersey: 79,
  'cayman-islands': 89,
  luxembourg: 82,
  'delaware-usa': 87,
  singapore: 85,
  cyprus: 83,
}

const STRATEGY_LABEL: Record<FundStrategy, string> = {
  'private-equity': 'PE',
  'real-estate': 'Real Estate',
  'venture-capital': 'Venture Capital',
  'private-credit': 'Private Credit',
}

export function InstantCostCalculator() {
  const [fundSize, setFundSize] = useState(100)
  const [lpCount, setLpCount] = useState(15)
  const [strategy, setStrategy] = useState<FundStrategy>('private-equity')

  const handleFundSizeChange = (value: number) => {
    setFundSize(value)
    trackEvent('calculator_fund_size_changed', {
      fundSize: value,
      lpCount,
      strategy,
    })
  }

  const handleLpCountChange = (value: number) => {
    setLpCount(value)
    trackEvent('calculator_lp_count_changed', {
      lpCount: value,
      fundSize,
      strategy,
    })
  }

  const handleStrategyChange = (value: FundStrategy) => {
    setStrategy(value)
    trackEvent('calculator_strategy_changed', {
      strategy: value,
      fundSize,
      lpCount,
    })
  }

  const topJurisdictions = useMemo(() => {
    const scoredById = new Map(
      JURISDICTIONS.map((j) => {
        let formationCost = (j.formationCostRange.min + j.formationCostRange.max) / 2

        const strategyMultiplier: Record<FundStrategy, number> = {
          'private-equity': 1,
          'real-estate': 1.08,
          'venture-capital': 0.94,
          'private-credit': 1.12,
        }

        formationCost *= strategyMultiplier[strategy]

        if (fundSize > 250) formationCost *= 1.3
        if (fundSize > 500) formationCost *= 1.5

        formationCost += (lpCount - 10) * 500

        let annualCost = (j.annualCostRange.min + j.annualCostRange.max) / 2
        annualCost *= strategyMultiplier[strategy]
        if (fundSize > 250) annualCost *= 1.2

        const totalYear1 = formationCost + annualCost

        const score = BASE_SCORES[j.id] ?? 75

        return [
          j.id,
          {
            id: j.id,
            name: j.name,
            flag: j.flag,
            formationCost: Math.round(formationCost),
            annualCost: Math.round(annualCost),
            totalYear1: Math.round(totalYear1),
            score,
            timeline: `${j.setupTimeWeeks.min}-${j.setupTimeWeeks.max} weeks`,
          },
        ] as const
      })
    )

    return PREVIEW_JURISDICTIONS.map((jurisdictionId) => scoredById.get(jurisdictionId)).filter(
      (jurisdiction): jurisdiction is NonNullable<typeof jurisdiction> => Boolean(jurisdiction)
    )
  }, [fundSize, lpCount, strategy])

  const scoreContext = `Score based on: ${STRATEGY_LABEL[strategy]} strategy · €${fundSize}M fund · ${lpCount} LPs · default LP mix`

  return (
    <section id="cost-calculator" className="w-full border-y border-bg-border bg-bg-surface py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-serif text-4xl text-text-primary md:text-5xl">
            How Much Does Your Fund Actually Cost?
          </h2>
          <p className="text-lg text-text-secondary">
            Move the sliders to see real formation costs across jurisdictions
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-bg-border bg-bg-elevated p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label className="font-sans text-sm text-text-secondary">Target Fund Size</label>
                <span className="font-serif text-2xl text-accent-gold">€{fundSize}M</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={fundSize}
                onChange={(e) => handleFundSizeChange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-bg-border accent-accent-gold"
              />
              <div className="mt-1 flex justify-between text-xs text-text-tertiary">
                <span>€10M</span>
                <span>€500M</span>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <label className="font-sans text-sm text-text-secondary">Number of LPs</label>
                <span className="font-serif text-2xl text-accent-gold">{lpCount}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={lpCount}
                onChange={(e) => handleLpCountChange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-bg-border accent-accent-gold"
              />
              <div className="mt-1 flex justify-between text-xs text-text-tertiary">
                <span>5 LPs</span>
                <span>50 LPs</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-sans text-sm text-text-secondary">
              Fund Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => handleStrategyChange(e.target.value as FundStrategy)}
              className="w-full rounded-sm border border-bg-border bg-bg-primary px-4 py-3 text-text-primary focus:border-accent-gold focus:outline-none"
            >
              <option value="private-equity">Private Equity</option>
              <option value="real-estate">Real Estate</option>
              <option value="venture-capital">Venture Capital</option>
              <option value="private-credit">Private Credit</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {topJurisdictions.map((j, index) => (
            <div
              key={j.id}
              className={`rounded-lg border bg-bg-elevated p-6 transition-all duration-200 hover:border-accent-gold/50 ${
                index === 0 ? 'border-accent-gold' : 'border-bg-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{j.flag}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl text-text-primary">{j.name}</h3>
                      {index === 0 && (
                        <span className="rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2 py-1 text-xs text-accent-gold">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
                      <span>Formation: {formatCurrency(j.formationCost, true)}</span>
                      <span>•</span>
                      <span>Annual: {formatCurrency(j.annualCost, true)}</span>
                      <span>•</span>
                      <span>{j.timeline}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif text-3xl text-accent-gold">
                    {formatCurrency(j.totalYear1, true)}
                  </div>
                  <div className="mt-1 text-xs text-text-tertiary">Year 1 Total</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
                  <span>Suitability Score</span>
                  <span className="font-semibold text-accent-gold">{j.score}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-border">
                  <div
                    className="h-full bg-gradient-to-r from-accent-gold to-accent-gold-light transition-all duration-1000 ease-out"
                    style={{ width: `${j.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-text-tertiary">{scoreContext}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/coverage"
            className="inline-block rounded-sm bg-accent-gold px-8 py-4 font-semibold text-bg-primary transition-all duration-200 hover:bg-accent-gold-light"
          >
            {`See Full ${JURISDICTIONS.length}-Jurisdiction Comparison →`}
          </Link>
          <p className="mt-4 text-sm text-text-tertiary">
            Or start the full Architect Engine to get personalized recommendations
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-text-secondary">
            Cost estimates last verified: February 19, 2026. Actual costs vary by service provider,
            fund complexity, and negotiated fees. Consult qualified counsel for binding cost
            estimates.
          </p>
        </div>
      </div>
    </section>
  )
}
