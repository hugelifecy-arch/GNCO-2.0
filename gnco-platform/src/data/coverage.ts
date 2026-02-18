import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

export type CoverageConfidence = 'High' | 'Med' | 'Low'

export interface CoverageJurisdiction {
  name: string
  slug: string
  formationCostRange: string
  timelineRange: string
  included: string[]
  excluded: string[]
  sourceTypes: string[]
  lastUpdated: string
  confidence: CoverageConfidence
  changeLog?: { date: string; note: string }[]
}

const confidenceByStatus = {
  full: 'High',
  partial: 'Med',
  'coming-soon': 'Low',
} as const

const sourceTypesByStatus = {
  full: ['regulator guidance', 'public fee schedule', 'law firm briefing', 'administrator quote'],
  partial: ['regulator guidance', 'public fee schedule', 'law firm briefing'],
  'coming-soon': ['regulator guidance', 'public fee schedule'],
} as const

export const COVERAGE_DATA: CoverageJurisdiction[] = JURISDICTIONS.map((jurisdiction) => ({
  name: jurisdiction.name,
  slug: jurisdiction.id,
  formationCostRange: `USD ${Math.round(jurisdiction.formationCostRange.min / 1000)}K–${Math.round(jurisdiction.formationCostRange.max / 1000)}K`,
  timelineRange: `${jurisdiction.setupTimeWeeks.min}–${jurisdiction.setupTimeWeeks.max} weeks`,
  included: jurisdiction.bestFor,
  excluded: jurisdiction.notIdealFor,
  sourceTypes: [...sourceTypesByStatus[jurisdiction.coverageStatus]],
  lastUpdated: JURISDICTION_METADATA[jurisdiction.id]?.lastUpdated ?? '2026-02-18',
  confidence: confidenceByStatus[jurisdiction.coverageStatus],
  changeLog: [
    {
      date: JURISDICTION_METADATA[jurisdiction.id]?.lastUpdated ?? '2026-02-18',
      note: `Coverage baseline for ${jurisdiction.name} refreshed from current source mix.`,
    },
  ],
}))

export function getCoverageBySlug(slug: string) {
  return COVERAGE_DATA.find((item) => item.slug === slug)
}
