'use client'

import { useMemo } from 'react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface JCurveDataPoint {
  year: number
  netIRR: number
  dpi: number
  rvpi: number
}

interface JCurveBenchmarkPoint {
  year: number
  medianIRR: number
}

interface JCurveProps {
  fundName: string
  vintageYear: number
  data: JCurveDataPoint[]
  benchmarkData?: JCurveBenchmarkPoint[]
}

const BRAND_COLOR = '#C9A84C'
const PEER_COLOR = '#8FA3BF'

export function JCurve({ fundName, vintageYear, data, benchmarkData = [] }: JCurveProps) {
  const chartData = useMemo(() => {
    const benchmarkByYear = new Map(benchmarkData.map((point) => [point.year, point.medianIRR]))

    return data
      .map((point) => ({
        ...point,
        yearsSinceVintage: point.year - vintageYear,
        medianIRR: benchmarkByYear.get(point.year),
      }))
      .sort((a, b) => a.yearsSinceVintage - b.yearsSinceVintage)
  }, [benchmarkData, data, vintageYear])

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-text-primary">{fundName} J-Curve</h2>
        <p className="text-sm text-text-secondary">Net IRR progression since {vintageYear} vintage</p>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 24, right: 24, left: 8, bottom: 24 }}>
            <CartesianGrid stroke="#1E2D42" strokeDasharray="3 3" />
            <ReferenceArea y1={-30} y2={0} fill="#EF4444" fillOpacity={0.1} />
            <ReferenceLine y={0} stroke="#F0F4FF" strokeDasharray="6 4" />

            <XAxis
              dataKey="yearsSinceVintage"
              type="number"
              domain={[0, 'dataMax']}
              allowDecimals={false}
              tick={{ fill: '#8FA3BF', fontSize: 12 }}
              axisLine={{ stroke: '#1E2D42' }}
              tickLine={{ stroke: '#1E2D42' }}
              label={{ value: 'Years Since Vintage', position: 'insideBottom', fill: '#8FA3BF', offset: -10 }}
            />
            <YAxis
              domain={[-30, 30]}
              tick={{ fill: '#8FA3BF', fontSize: 12 }}
              tickFormatter={(value: number) => `${value}%`}
              axisLine={{ stroke: '#1E2D42' }}
              tickLine={{ stroke: '#1E2D42' }}
              label={{ value: 'Net IRR', angle: -90, position: 'insideLeft', fill: '#8FA3BF' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1E2D42', borderRadius: 8, color: '#F0F4FF' }}
              labelStyle={{ color: '#E8C97A' }}
              labelFormatter={(value) => `Year ${value} since vintage`}
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
            />
            <Legend wrapperStyle={{ color: '#8FA3BF' }} />

            <Line type="monotone" dataKey="netIRR" name="Fund Net IRR" stroke={BRAND_COLOR} strokeWidth={2.5} dot={false} />
            <Line
              type="monotone"
              dataKey="medianIRR"
              name="Median Peer IRR"
              stroke={PEER_COLOR}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
            />

            <ReferenceLine x={2} stroke="transparent">
              <Label value="J-Curve valley typically years 1-3" fill="#FCA5A5" fontSize={12} position="insideTopLeft" />
            </ReferenceLine>
            <ReferenceLine x={5} stroke="transparent">
              <Label value="Value creation zone years 4-7" fill="#86EFAC" fontSize={12} position="insideTop" />
            </ReferenceLine>
            <ReferenceLine x={8} stroke="transparent">
              <Label value="Harvest period years 7-10+" fill="#93C5FD" fontSize={12} position="insideTopRight" />
            </ReferenceLine>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
