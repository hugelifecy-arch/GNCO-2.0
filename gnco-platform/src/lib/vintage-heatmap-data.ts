export type VintageQuartile = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'blank'
export type VintageMetricType = 'IRR' | 'MOIC'

export interface VintageHeatmapCell {
  year: number
  strategy: 'PE Buyout' | 'VC' | 'Real Estate' | 'Credit' | 'Infrastructure'
  quartile: VintageQuartile
  metricType?: VintageMetricType
  metricValue?: number
  fundName?: string
  gpName?: string
  commitmentSize?: number
  status?: 'Fundraising' | 'Investing' | 'Harvesting' | 'Fully Realized'
  fundSlug?: string
}

export const VINTAGE_YEARS = Array.from({ length: 15 }, (_, index) => 2010 + index)
export const FUND_STRATEGIES: VintageHeatmapCell['strategy'][] = ['PE Buyout', 'VC', 'Real Estate', 'Credit', 'Infrastructure']

const STRATEGY_BASE: Record<
  VintageHeatmapCell['strategy'],
  { gp: string; commitmentBase: number; moicBase: number; irrBase: number; quartiles: Array<'Q1' | 'Q2' | 'Q3' | 'Q4'> }
> = {
  'PE Buyout': { gp: 'Northbridge Capital', commitmentBase: 72, moicBase: 1.95, irrBase: 14.8, quartiles: ['Q1', 'Q2', 'Q1', 'Q2'] },
  VC: { gp: 'Pioneer Ventures', commitmentBase: 34, moicBase: 1.45, irrBase: 16.9, quartiles: ['Q2', 'Q1', 'Q3', 'Q4'] },
  'Real Estate': { gp: 'Stonebridge RE', commitmentBase: 63, moicBase: 1.62, irrBase: 11.8, quartiles: ['Q2', 'Q1', 'Q2', 'Q3'] },
  Credit: { gp: 'Vantage Credit', commitmentBase: 58, moicBase: 1.58, irrBase: 12.7, quartiles: ['Q1', 'Q2', 'Q2', 'Q3'] },
  Infrastructure: { gp: 'BlueHarbor Infra', commitmentBase: 68, moicBase: 1.55, irrBase: 13.5, quartiles: ['Q2', 'Q1', 'Q2', 'Q3'] },
}

function makeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const MOCK_VINTAGE_HEATMAP_DATA: VintageHeatmapCell[] = FUND_STRATEGIES.flatMap((strategy) =>
  VINTAGE_YEARS.map((year, index) => {
    if (year >= 2023) {
      return { year, strategy, quartile: 'blank' as const }
    }

    const { gp, commitmentBase, moicBase, irrBase, quartiles } = STRATEGY_BASE[strategy]
    const isMature = year <= 2012
    const quartile = quartiles[index % quartiles.length]
    const metricType: VintageMetricType = isMature ? 'MOIC' : 'IRR'
    const metricValue = Number((isMature ? moicBase + ((index % 3) - 1) * 0.24 : irrBase + ((index % 5) - 2) * 1.5).toFixed(isMature ? 2 : 1))
    const status = year <= 2012 ? 'Fully Realized' : year <= 2017 ? 'Harvesting' : 'Investing'
    const fundName = `${strategy} Fund ${String.fromCharCode(65 + (index % 26))}`

    return {
      year,
      strategy,
      quartile,
      metricType,
      metricValue,
      fundName,
      gpName: gp,
      commitmentSize: Math.round((commitmentBase + index * 3) * 1_000_000),
      status,
      fundSlug: makeSlug(`${strategy}-${year}-${fundName}`),
    }
  })
)
