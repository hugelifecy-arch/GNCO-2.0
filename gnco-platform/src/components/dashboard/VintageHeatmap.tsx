'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  FUND_STRATEGIES,
  MOCK_VINTAGE_HEATMAP_DATA,
  VINTAGE_YEARS,
  type VintageHeatmapCell,
  type VintageQuartile,
} from '@/lib/vintage-heatmap-data'

const QUARTILE_STYLES: Record<VintageQuartile, string> = {
  Q1: 'bg-emerald-800 text-emerald-50',
  Q2: 'bg-emerald-500/90 text-emerald-950',
  Q3: 'bg-amber-400 text-amber-950',
  Q4: 'bg-red-500/90 text-red-50',
  blank: 'bg-bg-elevated text-text-tertiary',
}

function formatCommitmentSize(value?: number) {
  if (!value) return 'N/A'
  return `$${(value / 1_000_000).toFixed(0)}M`
}

function formatMetric(cell: VintageHeatmapCell) {
  if (!cell.metricType || cell.metricValue === undefined) return '—'
  return cell.metricType === 'IRR' ? `${cell.metricValue.toFixed(1)}%` : `${cell.metricValue.toFixed(2)}x`
}

function CellContent({ cell, onHover }: { cell: VintageHeatmapCell; onHover: (cell: VintageHeatmapCell) => void }) {
  const baseClass = `h-14 w-full rounded px-1 text-center text-[11px] font-semibold transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-gold/60 ${QUARTILE_STYLES[cell.quartile]}`
  const label = `${cell.strategy} ${cell.year} ${cell.fundName ?? 'Unrealized'}`

  if (cell.fundSlug) {
    return (
      <Link
        href={`/funds/${cell.fundSlug}`}
        className={`${baseClass} inline-flex items-center justify-center`}
        aria-label={`${label} - open fund detail`}
        onMouseEnter={() => onHover(cell)}
        onFocus={() => onHover(cell)}
      >
        {formatMetric(cell)}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={baseClass}
      aria-label={label}
      onMouseEnter={() => onHover(cell)}
      onFocus={() => onHover(cell)}
      disabled
    >
      {formatMetric(cell)}
    </button>
  )
}

export function VintageHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<VintageHeatmapCell | null>(null)

  const cellMap = useMemo(() => {
    const map = new Map<string, VintageHeatmapCell>()
    for (const cell of MOCK_VINTAGE_HEATMAP_DATA) {
      map.set(`${cell.strategy}-${cell.year}`, cell)
    }
    return map
  }, [])

  return (
    <section className="rounded-lg border border-bg-border bg-bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-text-primary">Vintage Heatmap</h2>
          <p className="text-sm text-text-secondary">Quartile performance by vintage and strategy (replaces historical Excel tabs).</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary sm:grid-cols-5">
          {(['Q1', 'Q2', 'Q3', 'Q4', 'blank'] as const).map((quartile) => (
            <div key={quartile} className="flex items-center gap-2">
              <span className={`inline-flex h-3 w-3 rounded-sm ${QUARTILE_STYLES[quartile]}`} />
              <span>{quartile === 'blank' ? 'Unrealized' : quartile}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-bg-surface px-2 py-2 text-left text-text-secondary">Strategy</th>
              {VINTAGE_YEARS.map((year) => (
                <th key={year} className="px-2 py-2 text-center text-text-secondary" scope="col">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUND_STRATEGIES.map((strategy) => (
              <tr key={strategy}>
                <th className="sticky left-0 bg-bg-surface px-2 py-2 text-left font-medium text-text-primary" scope="row">
                  {strategy}
                </th>
                {VINTAGE_YEARS.map((year) => {
                  const cell = cellMap.get(`${strategy}-${year}`) ?? { year, strategy, quartile: 'blank' }

                  return (
                    <td key={`${strategy}-${year}`} className="px-0.5 py-0.5">
                      <CellContent cell={cell} onHover={setHoveredCell} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-md border border-bg-border bg-bg-elevated p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Hover detail</p>
        {hoveredCell?.fundName ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium text-text-primary">{hoveredCell.fundName}</p>
            <p className="text-text-secondary">GP: {hoveredCell.gpName}</p>
            <p className="text-text-secondary">Commitment: {formatCommitmentSize(hoveredCell.commitmentSize)}</p>
            <p className="text-text-secondary">Status: {hoveredCell.status}</p>
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">Hover over a realized cell to see fund-level context. Click any realized cell to drill through to fund detail.</p>
        )}
      </div>
    </section>
  )
}
