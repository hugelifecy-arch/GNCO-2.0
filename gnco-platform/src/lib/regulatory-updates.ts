export type RegulatoryImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type RegulatoryUpdateStatus = 'PUBLISHED' | 'DRAFT'

export interface RegulatoryUpdate {
  id: string
  jurisdiction_id: string
  title: string
  summary: string
  impact_level: RegulatoryImpactLevel
  effective_date: string
  affects_vehicle_types: string[]
  source_url: string
  created_at: string
  status: RegulatoryUpdateStatus
}

export interface SavedStructure {
  id: string
  jurisdiction_id: string
  vehicle_type: string
  created_at: string
  last_viewed_regulatory_at: string
}

export const REGULATORY_UPDATES_STORAGE_KEY = 'gnco:regulatory-updates'
export const SAVED_STRUCTURES_STORAGE_KEY = 'gnco:saved-structures'

export const SEED_REGULATORY_UPDATES: RegulatoryUpdate[] = [
  {
    id: 'reg-lux-pillar-two-2026',
    jurisdiction_id: 'luxembourg',
    title: 'OECD Pillar Two — Luxembourg Update',
    summary:
      'Luxembourg has finalized Pillar Two implementation guidance for in-scope groups. Fund managers should validate consolidated revenue thresholds and governance controls before year-end reporting.',
    impact_level: 'HIGH',
    effective_date: '2026-01-01',
    affects_vehicle_types: ['RAIF', 'SIF'],
    source_url: 'https://impotsdirects.public.lu/fr/actualites.html',
    created_at: '2026-01-12T09:00:00.000Z',
    status: 'PUBLISHED',
  },
  {
    id: 'reg-cayman-aml-2026',
    jurisdiction_id: 'cayman-islands',
    title: 'CIMA AML Rules Refresh',
    summary:
      'CIMA published updated AML/CFT expectations for investment entities and fund operators. Managers should confirm investor onboarding, sanctions screening, and evidence retention controls align with the revised guidance.',
    impact_level: 'MEDIUM',
    effective_date: '2026-02-15',
    affects_vehicle_types: ['ELP', 'SPC'],
    source_url: 'https://www.cima.ky/investment-funds',
    created_at: '2026-02-01T12:00:00.000Z',
    status: 'PUBLISHED',
  },
]
