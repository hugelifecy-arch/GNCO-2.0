'use client'

import {
  REGULATORY_UPDATES_STORAGE_KEY,
  SAVED_STRUCTURES_STORAGE_KEY,
  type RegulatoryUpdate,
  type SavedStructure,
  SEED_REGULATORY_UPDATES,
} from '@/lib/regulatory-updates'

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function getRegulatoryUpdates(): RegulatoryUpdate[] {
  if (typeof window === 'undefined') return SEED_REGULATORY_UPDATES
  const local = parseJson<RegulatoryUpdate[]>(window.localStorage.getItem(REGULATORY_UPDATES_STORAGE_KEY), [])
  return [...SEED_REGULATORY_UPDATES, ...local]
}

export function saveRegulatoryUpdate(update: RegulatoryUpdate): void {
  if (typeof window === 'undefined') return
  const local = parseJson<RegulatoryUpdate[]>(window.localStorage.getItem(REGULATORY_UPDATES_STORAGE_KEY), [])
  window.localStorage.setItem(REGULATORY_UPDATES_STORAGE_KEY, JSON.stringify([update, ...local]))
}

export function getSavedStructures(): SavedStructure[] {
  if (typeof window === 'undefined') return []
  return parseJson<SavedStructure[]>(window.localStorage.getItem(SAVED_STRUCTURES_STORAGE_KEY), [])
}

export function saveStructure(structure: SavedStructure): void {
  if (typeof window === 'undefined') return
  const structures = getSavedStructures()
  const next = [structure, ...structures.filter((item) => item.id !== structure.id)]
  window.localStorage.setItem(SAVED_STRUCTURES_STORAGE_KEY, JSON.stringify(next))
}

export function markStructuresAsViewed(jurisdictionId: string, viewedAt: string): void {
  if (typeof window === 'undefined') return
  const next = getSavedStructures().map((structure) =>
    structure.jurisdiction_id === jurisdictionId
      ? { ...structure, last_viewed_regulatory_at: viewedAt }
      : structure
  )
  window.localStorage.setItem(SAVED_STRUCTURES_STORAGE_KEY, JSON.stringify(next))
}
