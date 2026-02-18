'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { PerformanceDataPoint } from '@/lib/types'

type RangeOption = '1Y' | '2Y' | '3Y'

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [range, setRange] = useState<RangeOption>('3Y')

  const filtered = useMemo(() => {
    const size = range === '1Y' ? 12 : range === '2Y' ? 24 : 36
    const sliced = data.slice(-size)
    let cumulativePortfolio = 0
    let cumulativeBenchmark = 0

    return sliced.map((point) => {
      cumulativePortfolio += point.portfolioReturn
      cumulativeBenchmark += point.benchmarkReturn
      return {
        ...point,
        label: new Date(`${point.month}-01`).toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        cumulativePortfolio: Number(cumulativePortfolio.toFixed(2)),
        cumulativeBenchmark: Number(cumulativeBenchmark.toFixed(2)),
      }
    })
  }, [data, range])

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-text-primary">Portfolio Performance</h2>
          <p className="text-sm text-text-secondary">Cumulative Net Return</p>
        </div>
        <div className="inline-flex rounded-md border border-bg-border bg-bg-elevated p-1">
          {(['1Y', '2Y', '3Y'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              className={`rounded px-3 py-1 text-sm transition ${
                option === range ? 'bg-accent-gold/20 text-accent-gold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer>
          <LineChart data={filtered}>
            <CartesianGrid stroke="#1E2D42" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#8FA3BF', fontSize: 12 }}
              interval={5}
              axisLine={{ stroke: '#1E2D42' }}
              tickLine={{ stroke: '#1E2D42' }}
            />
            <YAxis
              tick={{ fill: '#8FA3BF', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              axisLine={{ stroke: '#1E2D42' }}
              tickLine={{ stroke: '#1E2D42' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1E2D42', borderRadius: 8, color: '#F0F4FF' }}
              labelStyle={{ color: '#E8C97A' }}
              formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
            />
            <Legend wrapperStyle={{ color: '#8FA3BF' }} />
            <Line
              type="monotone"
              dataKey="cumulativePortfolio"
              stroke="#C9A84C"
              strokeWidth={2}
              dot={false}
              name="GNCO Portfolio"
            />
            <Line
              type="monotone"
              dataKey="cumulativeBenchmark"
              stroke="#3B82F6"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
              name="MSCI World Benchmark"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
