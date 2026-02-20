'use client'

import { useMemo, useState } from 'react'
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'

import type { ExposureFund } from '@/lib/types'

type ExposureView = 'commitment' | 'nav' | 'netIRR'

interface ExposureTreemapProps {
  funds: ExposureFund[]
}

interface TreemapNode {
  name: string
  children?: TreemapNode[]
  value?: number
  fill?: string
  fund?: ExposureFund
}

const VIEW_OPTIONS: { key: ExposureView; label: string }[] = [
  { key: 'commitment', label: 'Commitment' },
  { key: 'nav', label: 'NAV' },
  { key: 'netIRR', label: 'Net IRR' },
]

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function concentrationColor(maxCountryShare: number) {
  if (maxCountryShare > 70) return '#DC2626'
  if (maxCountryShare > 50) return '#D97706'
  if (maxCountryShare < 30) return '#16A34A'
  return '#2563EB'
}

function concentrationLabel(maxCountryShare: number) {
  if (maxCountryShare > 70) return 'High concentration risk'
  if (maxCountryShare > 50) return 'Elevated concentration risk'
  if (maxCountryShare < 30) return 'Diversified exposure'
  return 'Moderate concentration'
}

function formatViewValue(view: ExposureView, fund: ExposureFund) {
  if (view === 'commitment') return currency.format(fund.commitment)
  if (view === 'nav') return currency.format(fund.currentNav)
  return `${fund.netIRR.toFixed(1)}%`
}

function formatSignedCurrency(value: number) {
  if (value > 0) return `+${currency.format(value)}`
  return currency.format(value)
}

export function ExposureTreemap({ funds }: ExposureTreemapProps) {
  const [view, setView] = useState<ExposureView>('commitment')

  const data = useMemo<TreemapNode[]>(() => {
    const byAssetClass = new Map<string, ExposureFund[]>()

    for (const fund of funds) {
      const existing = byAssetClass.get(fund.assetClass) ?? []
      existing.push(fund)
      byAssetClass.set(fund.assetClass, existing)
    }

    return Array.from(byAssetClass.entries()).map(([assetClass, assetClassFunds]) => {
      const gpMap = new Map<string, ExposureFund[]>()

      for (const fund of assetClassFunds) {
        const existing = gpMap.get(fund.gpName) ?? []
        existing.push(fund)
        gpMap.set(fund.gpName, existing)
      }

      return {
        name: assetClass,
        children: Array.from(gpMap.entries()).map(([gpName, gpFunds]) => ({
          name: gpName,
          children: gpFunds.map((fund) => {
            const maxCountryShare = Math.max(...fund.countryConcentration.map((item) => item.share))

            return {
              name: fund.fundName,
              value: fund.commitment,
              fill: concentrationColor(maxCountryShare),
              fund,
            }
          }),
        })),
      }
    })
  }, [funds])

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl">Exposure Treemap</h3>
          <p className="text-sm text-text-secondary">Asset Class → GP → Fund (size by commitment €)</p>
        </div>
        <div className="inline-flex rounded border border-bg-border bg-bg-elevated p-1 text-xs">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={view === option.key}
              className={`rounded px-2.5 py-1.5 transition ${view === option.key ? 'bg-accent-gold/20 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setView(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#0D1520"
            isAnimationActive={false}
            content={({ depth, x, y, width, height, name, payload }) => {
              const node = payload as TreemapNode
              const fill = depth === 3 ? node.fill ?? '#2563EB' : depth === 2 ? '#1F2937' : '#111827'

              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#0D1520" strokeWidth={1} rx={4} ry={4} />
                  {width > 86 && height > 42 ? (
                    <text x={x + 8} y={y + 18} fill="#F8FAFC" fontSize={11}>
                      {name}
                    </text>
                  ) : null}
                  {depth === 3 && node.fund && width > 112 && height > 62 ? (
                    <text x={x + 8} y={y + 34} fill="#CBD5E1" fontSize={11}>
                      {formatViewValue(view, node.fund)}
                    </text>
                  ) : null}
                </g>
              )
            }}
          >
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1E2D42', borderRadius: 8 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const fund = (payload[0]?.payload as TreemapNode).fund
                if (!fund) return null

                const sortedConcentration = [...fund.countryConcentration].sort((a, b) => b.share - a.share)
                const topCountry = sortedConcentration[0]

                return (
                  <div className="rounded border border-bg-border bg-bg-surface p-3 text-xs text-text-secondary shadow-lg">
                    <div className="mb-1 font-medium text-text-primary">{fund.fundName}</div>
                    <div>Commitment: {currency.format(fund.commitment)}</div>
                    <div>Current NAV: {currency.format(fund.currentNav)}</div>
                    <div>Unrealized G/L: {formatSignedCurrency(fund.unrealizedGainLoss)}</div>
                    <div>Net IRR: {fund.netIRR.toFixed(1)}%</div>
                    <div className="mt-1">Top country: {topCountry.country} ({topCountry.share}%)</div>
                    <div>{concentrationLabel(topCountry.share)}</div>
                    <div className="mt-1">
                      Concentration split: {sortedConcentration.map((item) => `${item.country} ${item.share}%`).join(' · ')}
                    </div>
                  </div>
                )
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-600" /> &lt;30% single-country</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> &gt;50% single-country</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-600" /> &gt;70% single-country</span>
      </div>
    </section>
  )
}
