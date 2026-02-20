'use client'

import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { FundPerformance } from '@/lib/types'
import { usePrivacyMode } from '@/components/shared/PrivacyModeContext'

interface FundAllocationChartProps {
  funds: FundPerformance[]
}

const colors = ['#C9A84C', '#3B82F6', '#10B981', '#F59E0B', '#A855F7', '#EC4899', '#22D3EE']

export function FundAllocationChart({ funds }: FundAllocationChartProps) {
  const { formatPrivate, isPrivacyMode } = usePrivacyMode()
  const [activeFund, setActiveFund] = useState<string | null>(null)

  const total = useMemo(() => funds.reduce((sum, fund) => sum + fund.aum, 0), [funds])
  const data = useMemo(
    () =>
      funds.map((fund) => ({
        name: formatPrivate(fund.fundName, 'name', 'fund'),
        rawName: fund.fundName,
        value: fund.aum,
        pct: ((fund.aum / total) * 100).toFixed(1),
      })),
    [formatPrivate, funds, total]
  )

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <h3 className="mb-4 font-serif text-xl">Fund Allocation</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              onClick={(_, idx) => setActiveFund(data[idx]?.rawName ?? null)}
            >
              {data.map((fund, index) => (
                <Cell key={`slice-${index}`} fill={colors[index % colors.length]} opacity={activeFund ? (activeFund === fund.rawName ? 1 : 0.45) : 1} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1E2D42', borderRadius: 8 }}
              formatter={(value: number, _n, p) => [isPrivacyMode ? `${p.payload.pct}%` : formatPrivate(value, 'currency'), `${p.payload.name}`]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        {data.map((fund, index) => (
          <button
            type="button"
            key={fund.rawName}
            className={`flex items-center justify-between rounded border px-3 py-2 text-left ${
              activeFund === fund.rawName ? 'border-accent-gold/40 bg-accent-gold/10' : 'border-bg-border'
            }`}
            onClick={() => setActiveFund(fund.rawName)}
          >
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              {fund.name}
            </span>
            <span className="text-text-secondary">{fund.pct}% AUM</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-tertiary">Click slice: highlights selected fund row in this legend (future KPI strip link).</p>
    </section>
  )
}
