import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

export type CoverageConfidence = 'High'

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
  lastVerifiedDate: string
  changeLog?: { date: string; note: string }[]
  citations: { title: string; url: string; publisher: string; access_date: string }[]
}

const confidenceByStatus = {
  full: 'High',
} as const

const sourceTypesByStatus = {
  full: ['regulator guidance', 'public fee schedule', 'law firm briefing', 'administrator quote'],
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
  lastVerifiedDate: JURISDICTION_METADATA[jurisdiction.id]?.last_verified_date ?? '2026-02-18',
  changeLog: [
    {
      date: JURISDICTION_METADATA[jurisdiction.id]?.lastUpdated ?? '2026-02-18',
      note: `Coverage baseline for ${jurisdiction.name} refreshed from current source mix.`,
    },
  ],
  citations: (JURISDICTION_METADATA[jurisdiction.id]?.citations ?? []).map((citation) => ({
    title: citation.title,
    url: citation.url,
    publisher: JURISDICTION_METADATA[jurisdiction.id]?.regulator.name ?? 'Official source',
    access_date: JURISDICTION_METADATA[jurisdiction.id]?.last_verified_date ?? '2026-02-18',
  })),
}))

export function getCoverageBySlug(slug: string) {
  return COVERAGE_DATA.find((item) => item.slug === slug)
}
