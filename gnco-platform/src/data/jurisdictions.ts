import { JURISDICTIONS } from '@/lib/jurisdiction-data'
import { JURISDICTION_METADATA } from '@/lib/jurisdiction-metadata'

export const JURISDICTIONS_CANONICAL = JURISDICTIONS.map((jurisdiction) => ({
  ...jurisdiction,
  ...JURISDICTION_METADATA[jurisdiction.id],
}))
