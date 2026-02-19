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

export function buildWeeklyDigestLine(structure: SavedStructure, count: number): string {
  return `${count} regulatory updates affecting your ${structure.jurisdiction_id} ${structure.vehicle_type} structure`
}

export function getActiveHighImpactAlerts(jurisdictionId: string, updates: RegulatoryUpdate[]): RegulatoryUpdate[] {
  return updates.filter(
    (update) =>
      update.status === 'PUBLISHED' && update.jurisdiction_id === jurisdictionId && update.impact_level === 'HIGH'
  )
}
