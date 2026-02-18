'use client'

import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { useCountUp } from '@/hooks/useCountUp'

interface KPIStripProps {
  totalAUM: number
  netIRR: number
  unfundedCommitments: number
  totalLPs: number
  activeFunds: number
}

const sparklineData = [
  { v: 2.2 },
  { v: 2.4 },
  { v: 2.45 },
  { v: 2.61 },
  { v: 2.8 },
  { v: 3.01 },
  { v: 3.24 },
]

export function KPIStrip({ totalAUM, netIRR, unfundedCommitments, totalLPs, activeFunds }: KPIStripProps) {
  const aumValue = useCountUp({ end: totalAUM / 1_000_000_000, duration: 1500, decimals: 2 })
  const irrValue = useCountUp({ end: netIRR, duration: 1400, decimals: 1 })
  const unfundedValue = useCountUp({ end: unfundedCommitments / 1_000_000, duration: 1500, decimals: 0 })
  const lpValue = useCountUp({ end: totalLPs, duration: 1000, decimals: 0 })

  const cards = useMemo(
    () => [
      {
        title: 'Total AUM',
        value: `$${aumValue.toFixed(2)}B`,
        subtitle: '+12.4% YTD',
        chart: true,
      },
      {
        title: 'Net IRR',
        value: `${irrValue.toFixed(1)}%`,
        subtitle: '(Since Inception)',
      },
      {
        title: 'Unfunded Commitments',
        value: `$${unfundedValue.toFixed(0)}M`,
        subtitle: `Across ${activeFunds} active funds`,
      },
      {
        title: 'Active LPs',
        value: `${lpValue.toFixed(0)}`,
        subtitle: `Across ${activeFunds} funds`,
      },
    ],
    [activeFunds, aumValue, irrValue, lpValue, unfundedValue]
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.title} className="rounded-lg border border-bg-border bg-bg-surface p-6">
          <p className="text-sm text-text-secondary">{card.title}</p>
          <p className="mt-3 font-serif text-3xl text-accent-gold">{card.value}</p>
          <p className="mt-2 text-sm text-text-secondary">{card.subtitle}</p>
          {card.chart ? (
            <div className="mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id="aumSpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#C9A84C" strokeWidth={2} fill="url(#aumSpark)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
