import { nanoid } from 'nanoid'

export type SavedComparison = {
  id: string
  name: string
  createdAt: string
  columns: string[]
  scoreSummary: number
  payload: Record<string, unknown>
}

export type SharedComparison = {
  id: string
  createdAt: string
  password?: string
  payload: Record<string, unknown>
}

const savedComparisons = new Map<string, SavedComparison>()
const sharedComparisons = new Map<string, SharedComparison>()

export function createSavedComparison(input: Omit<SavedComparison, 'id' | 'createdAt'>): SavedComparison {
  const comparison: SavedComparison = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    ...input,
  }
  savedComparisons.set(comparison.id, comparison)
  return comparison
}

export function listSavedComparisons() {
  return Array.from(savedComparisons.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function createSharedComparison(payload: Record<string, unknown>, password?: string) {
  const shared: SharedComparison = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    password,
    payload,
  }
  sharedComparisons.set(shared.id, shared)
  return shared
}

export function getSharedComparison(id: string) {
  return sharedComparisons.get(id)
}
