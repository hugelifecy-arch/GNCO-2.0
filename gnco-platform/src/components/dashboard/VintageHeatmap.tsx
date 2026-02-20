'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Quartile = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'blank'
type MetricType = 'IRR' | 'MOIC'

interface VintageCell {
  year: number
  strategy: string
  quartile: Quartile
  metricType?: MetricType
  metricValue?: number
  fundName?: string
  gpName?: string
  commitmentSize?: number
  status?: 'Fundraising' | 'Investing' | 'Harvesting' | 'Fully Realized'
  fundSlug?: string
}

const YEARS = Array.from({ length: 15 }, (_, index) => 2010 + index)
const STRATEGIES = ['PE Buyout', 'VC', 'Real Estate', 'Credit', 'Infrastructure'] as const

const QUARTILE_STYLES: Record<Quartile, string> = {
  Q1: 'bg-emerald-800 text-emerald-50',
  Q2: 'bg-emerald-500/90 text-emerald-950',
  Q3: 'bg-amber-400 text-amber-950',
  Q4: 'bg-red-500/90 text-red-50',
  blank: 'bg-bg-elevated text-text-tertiary',
}

const MOCK_VINTAGE_DATA: VintageCell[] = [
  { year: 2010, strategy: 'PE Buyout', quartile: 'Q1', metricType: 'MOIC', metricValue: 2.4, fundName: 'Northbridge Buyout Fund II', gpName: 'Northbridge Capital', commitmentSize: 72_000_000, status: 'Fully Realized', fundSlug: 'northbridge-buyout-fund-ii' },
  { year: 2011, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.8, fundName: 'Atlas Partners Fund IV', gpName: 'Atlas Partners', commitmentSize: 55_000_000, status: 'Fully Realized', fundSlug: 'atlas-partners-fund-iv' },
  { year: 2012, strategy: 'PE Buyout', quartile: 'Q1', metricType: 'MOIC', metricValue: 2.2, fundName: 'Harborline Equity V', gpName: 'Harborline', commitmentSize: 81_000_000, status: 'Fully Realized', fundSlug: 'harborline-equity-v' },
  { year: 2013, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'IRR', metricValue: 18.7, fundName: 'Crestpoint Buyout VI', gpName: 'Crestpoint', commitmentSize: 96_000_000, status: 'Harvesting', fundSlug: 'crestpoint-buyout-vi' },
  { year: 2014, strategy: 'PE Buyout', quartile: 'Q1', metricType: 'IRR', metricValue: 21.6, fundName: 'Argent Capital VII', gpName: 'Argent Capital', commitmentSize: 102_000_000, status: 'Harvesting', fundSlug: 'argent-capital-vii' },
  { year: 2015, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'IRR', metricValue: 16.4, fundName: 'Beacon Industrial VIII', gpName: 'Beacon Industrial', commitmentSize: 90_000_000, status: 'Harvesting', fundSlug: 'beacon-industrial-viii' },
  { year: 2016, strategy: 'PE Buyout', quartile: 'Q3', metricType: 'IRR', metricValue: 13.1, fundName: 'Summit Value IX', gpName: 'Summit Value', commitmentSize: 87_000_000, status: 'Harvesting', fundSlug: 'summit-value-ix' },
  { year: 2017, strategy: 'PE Buyout', quartile: 'Q1', metricType: 'IRR', metricValue: 19.5, fundName: 'Northbridge Buyout X', gpName: 'Northbridge Capital', commitmentSize: 108_000_000, status: 'Harvesting', fundSlug: 'northbridge-buyout-x' },
  { year: 2018, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'IRR', metricValue: 15.7, fundName: 'CrossRiver Buyout I', gpName: 'CrossRiver Partners', commitmentSize: 84_000_000, status: 'Investing', fundSlug: 'crossriver-buyout-i' },
  { year: 2019, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'IRR', metricValue: 14.8, fundName: 'Highland Equity II', gpName: 'Highland Equity', commitmentSize: 78_000_000, status: 'Investing', fundSlug: 'highland-equity-ii' },
  { year: 2020, strategy: 'PE Buyout', quartile: 'Q3', metricType: 'IRR', metricValue: 11.2, fundName: 'Keystone Buyout III', gpName: 'Keystone GP', commitmentSize: 92_000_000, status: 'Investing', fundSlug: 'keystone-buyout-iii' },
  { year: 2021, strategy: 'PE Buyout', quartile: 'Q2', metricType: 'IRR', metricValue: 13.5, fundName: 'Meridian Partners IV', gpName: 'Meridian Partners', commitmentSize: 99_000_000, status: 'Investing', fundSlug: 'meridian-partners-iv' },
  { year: 2022, strategy: 'PE Buyout', quartile: 'Q1', metricType: 'IRR', metricValue: 16.8, fundName: 'Liongate Capital V', gpName: 'Liongate Capital', commitmentSize: 110_000_000, status: 'Investing', fundSlug: 'liongate-capital-v' },
  { year: 2023, strategy: 'PE Buyout', quartile: 'blank' },
  { year: 2024, strategy: 'PE Buyout', quartile: 'blank' },
  { year: 2010, strategy: 'VC', quartile: 'Q3', metricType: 'MOIC', metricValue: 1.4, fundName: 'Vertex Ventures II', gpName: 'Vertex Ventures', commitmentSize: 32_000_000, status: 'Fully Realized', fundSlug: 'vertex-ventures-ii' },
  { year: 2011, strategy: 'VC', quartile: 'Q4', metricType: 'MOIC', metricValue: 0.9, fundName: 'Alpha Seed III', gpName: 'Alpha Seed', commitmentSize: 25_000_000, status: 'Fully Realized', fundSlug: 'alpha-seed-iii' },
  { year: 2012, strategy: 'VC', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.9, fundName: 'Skyline Ventures IV', gpName: 'Skyline Ventures', commitmentSize: 40_000_000, status: 'Fully Realized', fundSlug: 'skyline-ventures-iv' },
  { year: 2013, strategy: 'VC', quartile: 'Q1', metricType: 'IRR', metricValue: 26.3, fundName: 'Pioneer Tech V', gpName: 'Pioneer Tech', commitmentSize: 44_000_000, status: 'Harvesting', fundSlug: 'pioneer-tech-v' },
  { year: 2014, strategy: 'VC', quartile: 'Q2', metricType: 'IRR', metricValue: 20.9, fundName: 'Northstar VC VI', gpName: 'Northstar VC', commitmentSize: 48_000_000, status: 'Harvesting', fundSlug: 'northstar-vc-vi' },
  { year: 2015, strategy: 'VC', quartile: 'Q3', metricType: 'IRR', metricValue: 14.2, fundName: 'Catalyst Ventures VII', gpName: 'Catalyst Ventures', commitmentSize: 51_000_000, status: 'Harvesting', fundSlug: 'catalyst-ventures-vii' },
  { year: 2016, strategy: 'VC', quartile: 'Q2', metricType: 'IRR', metricValue: 18.1, fundName: 'Streamline Digital VIII', gpName: 'Streamline Digital', commitmentSize: 46_000_000, status: 'Harvesting', fundSlug: 'streamline-digital-viii' },
  { year: 2017, strategy: 'VC', quartile: 'Q1', metricType: 'IRR', metricValue: 23.4, fundName: 'Quantum Frontier IX', gpName: 'Quantum Frontier', commitmentSize: 60_000_000, status: 'Harvesting', fundSlug: 'quantum-frontier-ix' },
  { year: 2018, strategy: 'VC', quartile: 'Q2', metricType: 'IRR', metricValue: 17.8, fundName: 'Crescent Growth X', gpName: 'Crescent Growth', commitmentSize: 66_000_000, status: 'Investing', fundSlug: 'crescent-growth-x' },
  { year: 2019, strategy: 'VC', quartile: 'Q3', metricType: 'IRR', metricValue: 12.6, fundName: 'BluePeak Ventures XI', gpName: 'BluePeak Ventures', commitmentSize: 58_000_000, status: 'Investing', fundSlug: 'bluepeak-ventures-xi' },
  { year: 2020, strategy: 'VC', quartile: 'Q1', metricType: 'IRR', metricValue: 24.2, fundName: 'ArcLight Ventures XII', gpName: 'ArcLight Ventures', commitmentSize: 73_000_000, status: 'Investing', fundSlug: 'arclight-ventures-xii' },
  { year: 2021, strategy: 'VC', quartile: 'Q2', metricType: 'IRR', metricValue: 19.3, fundName: 'NovaCloud Capital XIII', gpName: 'NovaCloud Capital', commitmentSize: 76_000_000, status: 'Investing', fundSlug: 'novacloud-capital-xiii' },
  { year: 2022, strategy: 'VC', quartile: 'Q3', metricType: 'IRR', metricValue: 11.8, fundName: 'Helix Seed XIV', gpName: 'Helix Seed', commitmentSize: 62_000_000, status: 'Investing', fundSlug: 'helix-seed-xiv' },
  { year: 2023, strategy: 'VC', quartile: 'blank' },
  { year: 2024, strategy: 'VC', quartile: 'blank' },
  { year: 2010, strategy: 'Real Estate', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.7, fundName: 'Prime Property Income I', gpName: 'Prime Property', commitmentSize: 64_000_000, status: 'Fully Realized', fundSlug: 'prime-property-income-i' },
  { year: 2011, strategy: 'Real Estate', quartile: 'Q1', metricType: 'MOIC', metricValue: 2.1, fundName: 'Metro Assets II', gpName: 'Metro Assets', commitmentSize: 69_000_000, status: 'Fully Realized', fundSlug: 'metro-assets-ii' },
  { year: 2012, strategy: 'Real Estate', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.8, fundName: 'Harbor RE III', gpName: 'Harbor RE', commitmentSize: 72_000_000, status: 'Fully Realized', fundSlug: 'harbor-re-iii' },
  { year: 2013, strategy: 'Real Estate', quartile: 'Q3', metricType: 'IRR', metricValue: 12.7, fundName: 'Civic Real Estate IV', gpName: 'Civic Real Estate', commitmentSize: 77_000_000, status: 'Harvesting', fundSlug: 'civic-real-estate-iv' },
  { year: 2014, strategy: 'Real Estate', quartile: 'Q2', metricType: 'IRR', metricValue: 15.2, fundName: 'Stonebridge RE V', gpName: 'Stonebridge RE', commitmentSize: 81_000_000, status: 'Harvesting', fundSlug: 'stonebridge-re-v' },
  { year: 2015, strategy: 'Real Estate', quartile: 'Q3', metricType: 'IRR', metricValue: 11.4, fundName: 'UrbanCore RE VI', gpName: 'UrbanCore', commitmentSize: 85_000_000, status: 'Harvesting', fundSlug: 'urbancore-re-vi' },
  { year: 2016, strategy: 'Real Estate', quartile: 'Q1', metricType: 'IRR', metricValue: 17.6, fundName: 'Terrace Logistics VII', gpName: 'Terrace Logistics', commitmentSize: 89_000_000, status: 'Harvesting', fundSlug: 'terrace-logistics-vii' },
  { year: 2017, strategy: 'Real Estate', quartile: 'Q2', metricType: 'IRR', metricValue: 14.1, fundName: 'Parklane RE VIII', gpName: 'Parklane', commitmentSize: 94_000_000, status: 'Harvesting', fundSlug: 'parklane-re-viii' },
  { year: 2018, strategy: 'Real Estate', quartile: 'Q2', metricType: 'IRR', metricValue: 13.7, fundName: 'NorthPort Income IX', gpName: 'NorthPort', commitmentSize: 98_000_000, status: 'Investing', fundSlug: 'northport-income-ix' },
  { year: 2019, strategy: 'Real Estate', quartile: 'Q3', metricType: 'IRR', metricValue: 10.5, fundName: 'Westway Living X', gpName: 'Westway Living', commitmentSize: 102_000_000, status: 'Investing', fundSlug: 'westway-living-x' },
  { year: 2020, strategy: 'Real Estate', quartile: 'Q2', metricType: 'IRR', metricValue: 12.1, fundName: 'Summit Core XI', gpName: 'Summit Core', commitmentSize: 106_000_000, status: 'Investing', fundSlug: 'summit-core-xi' },
  { year: 2021, strategy: 'Real Estate', quartile: 'Q3', metricType: 'IRR', metricValue: 9.7, fundName: 'Avenue RE XII', gpName: 'Avenue RE', commitmentSize: 112_000_000, status: 'Investing', fundSlug: 'avenue-re-xii' },
  { year: 2022, strategy: 'Real Estate', quartile: 'Q2', metricType: 'IRR', metricValue: 11.3, fundName: 'Granite Property XIII', gpName: 'Granite Property', commitmentSize: 118_000_000, status: 'Investing', fundSlug: 'granite-property-xiii' },
  { year: 2023, strategy: 'Real Estate', quartile: 'blank' },
  { year: 2024, strategy: 'Real Estate', quartile: 'blank' },
  { year: 2010, strategy: 'Credit', quartile: 'Q1', metricType: 'MOIC', metricValue: 1.9, fundName: 'Anchor Credit I', gpName: 'Anchor Credit', commitmentSize: 57_000_000, status: 'Fully Realized', fundSlug: 'anchor-credit-i' },
  { year: 2011, strategy: 'Credit', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.6, fundName: 'Pinnacle Debt II', gpName: 'Pinnacle Debt', commitmentSize: 61_000_000, status: 'Fully Realized', fundSlug: 'pinnacle-debt-ii' },
  { year: 2012, strategy: 'Credit', quartile: 'Q1', metricType: 'MOIC', metricValue: 2.0, fundName: 'Latitude Credit III', gpName: 'Latitude Credit', commitmentSize: 65_000_000, status: 'Fully Realized', fundSlug: 'latitude-credit-iii' },
  { year: 2013, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 14.9, fundName: 'Atlas Lending IV', gpName: 'Atlas Lending', commitmentSize: 69_000_000, status: 'Harvesting', fundSlug: 'atlas-lending-iv' },
  { year: 2014, strategy: 'Credit', quartile: 'Q3', metricType: 'IRR', metricValue: 11.8, fundName: 'Signal Credit V', gpName: 'Signal Credit', commitmentSize: 73_000_000, status: 'Harvesting', fundSlug: 'signal-credit-v' },
  { year: 2015, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 13.2, fundName: 'Harbor Debt VI', gpName: 'Harbor Debt', commitmentSize: 76_000_000, status: 'Harvesting', fundSlug: 'harbor-debt-vi' },
  { year: 2016, strategy: 'Credit', quartile: 'Q1', metricType: 'IRR', metricValue: 16.3, fundName: 'Vantage Credit VII', gpName: 'Vantage Credit', commitmentSize: 81_000_000, status: 'Harvesting', fundSlug: 'vantage-credit-vii' },
  { year: 2017, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 14.2, fundName: 'IronBridge Debt VIII', gpName: 'IronBridge', commitmentSize: 86_000_000, status: 'Harvesting', fundSlug: 'ironbridge-debt-viii' },
  { year: 2018, strategy: 'Credit', quartile: 'Q1', metricType: 'IRR', metricValue: 17.4, fundName: 'Northline Credit IX', gpName: 'Northline Credit', commitmentSize: 91_000_000, status: 'Investing', fundSlug: 'northline-credit-ix' },
  { year: 2019, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 13.7, fundName: 'Granite Debt X', gpName: 'Granite Debt', commitmentSize: 95_000_000, status: 'Investing', fundSlug: 'granite-debt-x' },
  { year: 2020, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 12.9, fundName: 'Harbor Income XI', gpName: 'Harbor Income', commitmentSize: 100_000_000, status: 'Investing', fundSlug: 'harbor-income-xi' },
  { year: 2021, strategy: 'Credit', quartile: 'Q3', metricType: 'IRR', metricValue: 10.8, fundName: 'Arc Credit XII', gpName: 'Arc Credit', commitmentSize: 104_000_000, status: 'Investing', fundSlug: 'arc-credit-xii' },
  { year: 2022, strategy: 'Credit', quartile: 'Q2', metricType: 'IRR', metricValue: 12.4, fundName: 'Bridgewater Debt XIII', gpName: 'Bridgewater Debt', commitmentSize: 109_000_000, status: 'Investing', fundSlug: 'bridgewater-debt-xiii' },
  { year: 2023, strategy: 'Credit', quartile: 'blank' },
  { year: 2024, strategy: 'Credit', quartile: 'blank' },
  { year: 2010, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.8, fundName: 'Global Infra I', gpName: 'Global Infra Partners', commitmentSize: 70_000_000, status: 'Fully Realized', fundSlug: 'global-infra-i' },
  { year: 2011, strategy: 'Infrastructure', quartile: 'Q3', metricType: 'MOIC', metricValue: 1.5, fundName: 'Continental Infra II', gpName: 'Continental Infra', commitmentSize: 74_000_000, status: 'Fully Realized', fundSlug: 'continental-infra-ii' },
  { year: 2012, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'MOIC', metricValue: 1.7, fundName: 'Transit Growth III', gpName: 'Transit Growth', commitmentSize: 78_000_000, status: 'Fully Realized', fundSlug: 'transit-growth-iii' },
  { year: 2013, strategy: 'Infrastructure', quartile: 'Q1', metricType: 'IRR', metricValue: 19.2, fundName: 'Civic Infra IV', gpName: 'Civic Infra', commitmentSize: 83_000_000, status: 'Harvesting', fundSlug: 'civic-infra-iv' },
  { year: 2014, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'IRR', metricValue: 15.4, fundName: 'Bridge Asset V', gpName: 'Bridge Asset', commitmentSize: 87_000_000, status: 'Harvesting', fundSlug: 'bridge-asset-v' },
  { year: 2015, strategy: 'Infrastructure', quartile: 'Q3', metricType: 'IRR', metricValue: 12.2, fundName: 'North Grid VI', gpName: 'North Grid', commitmentSize: 92_000_000, status: 'Harvesting', fundSlug: 'north-grid-vi' },
  { year: 2016, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'IRR', metricValue: 14.1, fundName: 'Summit Infra VII', gpName: 'Summit Infra', commitmentSize: 97_000_000, status: 'Harvesting', fundSlug: 'summit-infra-vii' },
  { year: 2017, strategy: 'Infrastructure', quartile: 'Q1', metricType: 'IRR', metricValue: 17.6, fundName: 'BlueHarbor Infra VIII', gpName: 'BlueHarbor', commitmentSize: 101_000_000, status: 'Harvesting', fundSlug: 'blueharbor-infra-viii' },
  { year: 2018, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'IRR', metricValue: 14.8, fundName: 'Atlas Utilities IX', gpName: 'Atlas Utilities', commitmentSize: 105_000_000, status: 'Investing', fundSlug: 'atlas-utilities-ix' },
  { year: 2019, strategy: 'Infrastructure', quartile: 'Q3', metricType: 'IRR', metricValue: 11.4, fundName: 'Foundry Infra X', gpName: 'Foundry Infra', commitmentSize: 109_000_000, status: 'Investing', fundSlug: 'foundry-infra-x' },
  { year: 2020, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'IRR', metricValue: 13.6, fundName: 'Lighthouse Infra XI', gpName: 'Lighthouse Infra', commitmentSize: 114_000_000, status: 'Investing', fundSlug: 'lighthouse-infra-xi' },
  { year: 2021, strategy: 'Infrastructure', quartile: 'Q2', metricType: 'IRR', metricValue: 12.8, fundName: 'Evergreen Infra XII', gpName: 'Evergreen Infra', commitmentSize: 118_000_000, status: 'Investing', fundSlug: 'evergreen-infra-xii' },
  { year: 2022, strategy: 'Infrastructure', quartile: 'Q1', metricType: 'IRR', metricValue: 16.1, fundName: 'Gridline Infra XIII', gpName: 'Gridline Infra', commitmentSize: 123_000_000, status: 'Investing', fundSlug: 'gridline-infra-xiii' },
  { year: 2023, strategy: 'Infrastructure', quartile: 'blank' },
  { year: 2024, strategy: 'Infrastructure', quartile: 'blank' },
]

function formatCommitmentSize(value?: number) {
  if (!value) return 'N/A'
  return `$${(value / 1_000_000).toFixed(0)}M`
}

function formatMetric(cell: VintageCell) {
  if (!cell.metricType || cell.metricValue === undefined) return '—'
  return cell.metricType === 'IRR' ? `${cell.metricValue.toFixed(1)}%` : `${cell.metricValue.toFixed(2)}x`
}

export function VintageHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<VintageCell | null>(null)
  const [selectedCell, setSelectedCell] = useState<VintageCell | null>(null)

  const cellMap = useMemo(() => {
    const map = new Map<string, VintageCell>()
    for (const cell of MOCK_VINTAGE_DATA) {
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
              {YEARS.map((year) => (
                <th key={year} className="px-2 py-2 text-center text-text-secondary">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STRATEGIES.map((strategy) => (
              <tr key={strategy}>
                <td className="sticky left-0 bg-bg-surface px-2 py-2 font-medium text-text-primary">{strategy}</td>
                {YEARS.map((year) => {
                  const cell = cellMap.get(`${strategy}-${year}`) ?? { year, strategy, quartile: 'blank' }

                  return (
                    <td key={`${strategy}-${year}`} className="px-0.5 py-0.5">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell((prev) => (prev?.strategy === strategy && prev.year === year ? null : prev))}
                        onFocus={() => setHoveredCell(cell)}
                        onBlur={() => setHoveredCell((prev) => (prev?.strategy === strategy && prev.year === year ? null : prev))}
                        onClick={() => setSelectedCell(cell.fundName ? cell : null)}
                        className={`h-14 w-full rounded px-1 text-center text-[11px] font-semibold transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-gold/60 ${QUARTILE_STYLES[cell.quartile]}`}
                        aria-label={`${strategy} ${year} ${cell.fundName ?? 'Unrealized'}`}
                      >
                        {formatMetric(cell)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-bg-border bg-bg-elevated p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Hover detail</p>
          {hoveredCell?.fundName ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium text-text-primary">{hoveredCell.fundName}</p>
              <p className="text-text-secondary">GP: {hoveredCell.gpName}</p>
              <p className="text-text-secondary">Commitment: {formatCommitmentSize(hoveredCell.commitmentSize)}</p>
              <p className="text-text-secondary">Status: {hoveredCell.status}</p>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">Hover over a realized cell to see fund-level context.</p>
          )}
        </div>

        <div className="rounded-md border border-bg-border bg-bg-elevated p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Selected fund (drill-through)</p>
          {selectedCell?.fundName ? (
            <div className="space-y-2 text-sm">
              <p className="font-medium text-text-primary">{selectedCell.fundName}</p>
              <p className="text-text-secondary">{selectedCell.strategy} • Vintage {selectedCell.year}</p>
              <Link
                href={`/funds/${selectedCell.fundSlug ?? ''}`}
                className="inline-flex rounded border border-accent-gold/40 px-3 py-1 text-xs font-medium text-accent-gold hover:bg-accent-gold/10"
              >
                Open full fund detail
              </Link>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">Click a cell to drill through to full fund detail.</p>
          )}
        </div>
      </div>
    </section>
  )
}
