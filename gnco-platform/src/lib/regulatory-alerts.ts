import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import type { RegulatoryUpdate, SavedStructure } from '@/lib/regulatory-updates'

export function getUnreadRegulatoryUpdatesForStructure(
  structure: SavedStructure,
  updates: RegulatoryUpdate[]
): RegulatoryUpdate[] {
  const lastViewed = new Date(structure.last_viewed_regulatory_at)
  return updates.filter(
    (update) =>
      update.status === 'PUBLISHED' &&
      update.jurisdiction_id === structure.jurisdiction_id &&
      new Date(update.created_at) > lastViewed
  )
}

function formatJurisdictionLabel(jurisdictionId: string): string {
  return (
    JURISDICTIONS.find((jurisdiction) => jurisdiction.id === jurisdictionId)?.name ??
    jurisdictionId
      .split('-')
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(' ')
  )
}

export function buildWeeklyDigestLine(structure: SavedStructure, count: number): string {
  return `${count} regulatory updates affecting your ${formatJurisdictionLabel(structure.jurisdiction_id)} ${structure.vehicle_type} structure`
}

export function getActiveHighImpactAlerts(jurisdictionId: string, updates: RegulatoryUpdate[]): RegulatoryUpdate[] {
  return updates.filter(
    (update) =>
      update.status === 'PUBLISHED' && update.jurisdiction_id === jurisdictionId && update.impact_level === 'HIGH'
  )
}
